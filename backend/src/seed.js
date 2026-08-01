import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Subject from './models/Subject.js';
import Classroom from './models/Classroom.js';
import bcrypt from 'bcrypt';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clean existing demo data (Optional but helpful for consistency)
    await Subject.deleteMany({});
    await Classroom.deleteMany({});

    // 1. Ensure Admin exists (for us to login)
    let admin = await User.findOne({ email: 'admin@test.com' });
    if (!admin) {
      const hashed = await bcrypt.hash('admin123', 10);
      admin = await User.create({
        name: 'System Admin',
        email: 'admin@test.com',
        password: hashed,
        role: 'admin'
      });
    }

    // 2. Create Faculty
    const facultyData = [
      { name: 'Dr. Alan Turing', email: 'turing@test.com', role: 'faculty' },
      { name: 'Prof. Ada Lovelace', email: 'ada@test.com', role: 'faculty' },
      { name: 'Dr. Grace Hopper', email: 'hopper@test.com', role: 'faculty' }
    ];

    const faculty = [];
    for (const f of facultyData) {
      let user = await User.findOne({ email: f.email });
      if (!user) {
        const hashed = await bcrypt.hash('faculty123', 10);
        user = await User.create({ ...f, password: hashed });
      }
      faculty.push(user);
    }

    // 3. Create Classrooms
    const classrooms = await Classroom.create([
      { name: 'Quantum Laboratory', capacity: 30, features: ['Lab', 'Projector'] },
      { name: 'Main Auditorium', capacity: 120, features: ['Audio', 'Projector'] },
      { name: 'Collaborative Space A', capacity: 20, features: ['Whiteboard'] }
    ]);

    // 4. Create Subjects
    await Subject.create([
      { name: 'Artificial Intelligence', code: 'CS101', facultyId: faculty[0]._id, hoursPerWeek: 4 },
      { name: 'Cyber Security', code: 'CS202', facultyId: faculty[0]._id, hoursPerWeek: 3 },
      { name: 'Data Structures', code: 'CS303', facultyId: faculty[1]._id, hoursPerWeek: 4 },
      { name: 'Network Architecture', code: 'CS404', facultyId: faculty[2]._id, hoursPerWeek: 3 }
    ]);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
