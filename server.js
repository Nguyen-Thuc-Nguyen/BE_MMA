import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import loadEnv from './config/env.js';
import authRouter from './router/authRouter.js';
import parentRouter from './router/parentRouter.js';
import vaccineRouter from './router/vaccineRouter.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/parent', parentRouter);
app.use('/vaccine', vaccineRouter);

const startServer = async () => {
  try {
    await connectDB();
    loadEnv();
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to the database', error);
    process.exit(1);
  }
};

startServer();
