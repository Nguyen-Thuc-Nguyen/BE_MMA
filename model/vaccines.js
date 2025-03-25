import mongoose from 'mongoose';

const vaccineSchema = new mongoose.Schema(
  {
    vaccineId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    ageGroup: {
      type: String,
      required: true, // e.g., "0-6 months", "1-5 years"
    },
    dosesRequired: {
      type: Number,
      required: true,
    },
    intervalMonths: {
      type: Number,
    },
    intervalDays: {
      type: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Còn nhiều', 'Sắp hết', 'Hết'],
      default: 'Còn nhiều',
    },
  },
  { timestamps: true }
);

// Middleware để cập nhật trạng thái vaccine dựa trên số lượng còn lại
vaccineSchema.pre('save', function (next) {
  if (this.quantity <= 0) {
    this.status = 'Hết';
  } else if (this.quantity <= 50) {
    this.status = 'Sắp hết';
  } else {
    this.status = 'Còn nhiều';
  }
  next();
});

const Vaccine = mongoose.model('Vaccine', vaccineSchema);

export default Vaccine;
