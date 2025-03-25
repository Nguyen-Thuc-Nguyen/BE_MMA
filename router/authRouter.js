import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../model/users.js';
import Parent from '../model/parents.js';

dotenv.config();


const authRouter = express.Router();

const generateRandomName = () => `Parent${Math.floor(1000 + Math.random() * 9000)}`;

authRouter.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        const parent = new Parent({
            userId: newUser._id,
            name: generateRandomName(),
            phone: "N/A",
            address: "N/A",
            gender:"other",
        });
        await parent.save();

        res.status(201).json({
            message: 'User and parent profile created',
            user: {
                id: newUser._id,
                email: newUser.email,
                username: newUser.username,
            },
            parent,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login user
authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default authRouter;
