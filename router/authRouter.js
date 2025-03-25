import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../model/users.js';
import Parent from '../model/parents.js';
import authMiddleware from '../middleware/auth.js';
import blacklistedtoken from '../model/blacklistedtoken.js';

dotenv.config();

const authRouter = express.Router();

const generateRandomName = () =>
  `Parent${Math.floor(1000 + Math.random() * 9000)}`;

// Register User
authRouter.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const newUser = new User({
      username,
      email,
      password,
      status: 'Không hoạt động',
    });
    await newUser.save();

    const parent = new Parent({
      userId: newUser._id,
      name: generateRandomName(),
      phone: 'N/A',
      address: 'N/A',
      gender: 'Khác',
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

// Login User
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    user.status = 'Hoạt động';
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

authRouter.post('/logout', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;

    const updateResult = await User.updateOne(
      { _id: userId },
      { $set: { status: 'Không hoạt động' } }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    await blacklistedtoken.create({ token });

    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default authRouter;
