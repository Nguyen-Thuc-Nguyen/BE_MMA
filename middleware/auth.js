import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import blacklistedtoken from '../model/blacklistedtoken.js';

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Authorization denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Check if the token is blacklisted
    const blacklisted = await blacklistedtoken.findOne({ token });
    if (blacklisted) {
      return res
        .status(401)
        .json({ message: 'Token has been invalidated. Please log in again.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;
