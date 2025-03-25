import mongoose from 'mongoose';

const vaccineSchema = new mongoose.Schema({
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
}, { timestamps: true });

vaccineSchema.pre('save', function(next) {
    if (this.quantity <= 0) {
        this.status = 'Hết';
    } else if (this.quantity <= 50) {
        this.status = 'Sắp hết';
    } else {
        this.status = 'Còn nhiều';
    }
    next();  // tiếp tục lưu thông tin
});

const Vaccine = mongoose.model('Vaccine', vaccineSchema);

export default Vaccine;
