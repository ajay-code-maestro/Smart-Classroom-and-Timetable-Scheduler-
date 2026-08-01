import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

import subjectRoutes from './routes/subjectRoutes.js';
import classroomRoutes from './routes/classroomRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import labRoutes from './routes/labRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/labs', labRoutes);

app.get('/', (req, res) => {
  res.send('Smart Classroom API is running');
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-classroom')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log('MongoDB connection error:', error.message));
