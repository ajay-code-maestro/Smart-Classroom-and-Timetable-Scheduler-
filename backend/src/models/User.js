import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'faculty', 'student'], 
    default: 'student' 
  },
  // Faculty specific availability config
  availability: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
    startTime: String, // '09:00'
    endTime: String    // '17:00'
  }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
