import mongoose from 'mongoose';

const VaccineSlotSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    available_capacity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const VaccineSlot = mongoose.model('VaccineSlot', VaccineSlotSchema);

export default VaccineSlot;
