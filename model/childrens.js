import mongoose from 'mongoose';

const childSchema = new mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Nam', 'Nữ'],
    required: true,
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  medicalHistory: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

const Child = mongoose.model('Child', childSchema);
export default Child;
