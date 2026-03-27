const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Complaint = require('../models/Complaint');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Multer configuration for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'complaint-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) cb(null, true);
  else cb(new Error('Only image files (jpg, png, webp) are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// @route   POST /api/complaints
// @desc    Submit a new complaint
// @access  Private (User)
router.post('/', protect, upload.single('photo'), async (req, res) => {
  try {
    const { name, mobile, location, quarterNumber, department, complaintType, description } = req.body;

    if (!name || !mobile || !location || !quarterNumber || !department || !complaintType || !description) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const photoUrl = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const complaint = await Complaint.create({
      name,
      mobile,
      location,
      quarterNumber,
      department,
      complaintType,
      description,
      photoUrl,
      userId: req.user._id,
      status: 'Pending'
    });

    res.status(201).json({ message: 'Complaint submitted successfully', complaint });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error submitting complaint' });
  }
});

// @route   GET /api/complaints/my
// @desc    Get complaints of logged-in user
// @access  Private (User)
router.get('/my', protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaints' });
  }
});

// @route   GET /api/complaints/all
// @desc    Get all complaints (Admin)
// @access  Private (Admin)
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const { location, department, status } = req.query;
    const filter = {};
    if (location && location !== 'All') filter.location = location;
    if (department && department !== 'All') filter.department = department;
    if (status && status !== 'All') filter.status = status;

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const completed = await Complaint.countDocuments({ status: 'Completed' });

    res.json({ complaints, stats: { total, pending, inProgress, completed } });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaints' });
  }
});

// @route   PUT /api/complaints/:id/status
// @desc    Update complaint status and remarks (Admin)
// @access  Private (Admin)
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const validStatuses = ['Pending', 'In Progress', 'Completed'];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(remarks !== undefined && { remarks }) },
      { new: true, runValidators: true }
    );

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    res.json({ message: 'Complaint updated successfully', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Error updating complaint' });
  }
});

// @route   DELETE /api/complaints/:id
// @desc    Delete a complaint (Admin)
// @access  Private (Admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    // Remove photo file if exists
    if (complaint.photoUrl) {
      const filePath = path.join(__dirname, '..', complaint.photoUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting complaint' });
  }
});

// @route   GET /api/complaints/:id
// @desc    Get single complaint detail
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    // Regular users can only see their own complaints
    if (req.user.role !== 'admin' && complaint.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaint' });
  }
});

module.exports = router;
