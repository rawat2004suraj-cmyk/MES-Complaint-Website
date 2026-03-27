const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, mobile, password } = req.body;

    if (!name || !mobile || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ message: 'Mobile number already registered' });
    }

    const user = await User.create({ name, mobile, password, role: 'user' });

    res.status(201).json({
      message: 'Registration successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user or admin
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({ message: 'Please provide mobile and password' });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(401).json({ message: 'Invalid mobile number or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid mobile number or password' });
    }

    res.json({
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    mobile: req.user.mobile,
    role: req.user.role
  });
});

// @route   POST /api/auth/create-admin
// @desc    Create admin (use once, then remove or protect)
// @access  Public (DISABLE IN PRODUCTION)
router.post('/create-admin', async (req, res) => {
  try {
    const { name, mobile, password, secretKey } = req.body;

    if (secretKey !== 'MES_ADMIN_SECRET_2024') {
      return res.status(403).json({ message: 'Invalid secret key' });
    }

    const existingAdmin = await User.findOne({ mobile });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Mobile already registered' });
    }

    const admin = await User.create({ name, mobile, password, role: 'admin' });

    res.status(201).json({
      message: 'Admin created successfully',
      user: { id: admin._id, name: admin.name, mobile: admin.mobile, role: admin.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
