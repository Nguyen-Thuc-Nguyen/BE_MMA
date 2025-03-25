import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema(
    {
        slotId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "VaccineSlot",
            required: true,
        },
        childId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Child",
            required: true,
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Parent",
            required: true,
        },
        vaccineId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vaccine",
            required: true,
        },
        appointmentDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["Chờ xác nhận", "Đã xác nhận", "Bị hủy"],
            default: "Chờ xác nhận",
        },
        paymentStatus: {
            type: String,
            enum: ["Chưa thanh toán", "Đã thanh toán"],
            default: "Chưa thanh toán",
        },
        cancelNote: {
            type: String,
            maxlength: 255,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        doseNumber: {
            type: Number,
            required: true,
        },
        vaccinedDate: {
            type: Date,
        },
    },
    { timestamps: true }
);

const Appointment = mongoose.model('Appointment', AppointmentSchema);
export default Appointment;
