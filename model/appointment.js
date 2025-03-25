import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema(
  {
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot',
      required: true,
    },
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Child',
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parent',
      required: true,
    },
    vaccineId: { type: String, required: true }, // Use vaccineId instead of ObjectId reference
    appointmentDate: { type: Date, required: true },
    doseNumber: { type: Number, required: true },
    status: { type: String, default: 'Chờ xác nhận' },
    paymentStatus: { type: String, default: 'Chưa thanh toán' },
  },
  { timestamps: true }
);

const Appointment = mongoose.model('Appointment', AppointmentSchema);
export default Appointment;
