const mongoose = require('mongoose');

// Auto-generate complaint ID: MES-YYYYMMDD-XXX
async function generateComplaintId() {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const prefix = `MES-${dateStr}-`;

  const lastComplaint = await mongoose.model('Complaint').findOne(
    { complaintId: { $regex: `^${prefix}` } },
    {},
    { sort: { createdAt: -1 } }
  );

  let seq = 1;
  if (lastComplaint) {
    const lastSeq = parseInt(lastComplaint.complaintId.split('-')[2], 10);
    seq = lastSeq + 1;
  }

  return `${prefix}${String(seq).padStart(3, '0')}`;
}

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    enum: ['Yogendra Vihar', 'VRC', 'Bana Singh', 'APS']
  },
  quarterNumber: {
    type: String,
    required: [true, 'Quarter number is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['Water Supply', 'Electrical', 'B&R']
  },
  complaintType: {
    type: String,
    required: [true, 'Complaint type is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  photoUrl: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  remarks: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Pre-save hook to auto-generate complaintId
complaintSchema.pre('save', async function (next) {
  if (!this.complaintId) {
    this.complaintId = await generateComplaintId();
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
