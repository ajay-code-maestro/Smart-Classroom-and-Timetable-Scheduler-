import mongoose from 'mongoose';

const labSessionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], required: true },
  startSlot: { type: String, enum: ['09:00', '13:00'], required: true }, // e.g., "09:00"
  duration: { type: Number, required: true, default: 3, max: 3 }
}, { timestamps: true });

export default mongoose.model('LabSession', labSessionSchema);
