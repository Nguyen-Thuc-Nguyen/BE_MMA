import mongoose from 'mongoose';

const BlacklistedTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now, expires: '1d' } // Auto-delete after 1 day
});

export default mongoose.model('BlacklistedToken', BlacklistedTokenSchema);
