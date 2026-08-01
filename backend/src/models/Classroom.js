import mongoose from 'mongoose';

const classroomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  features: [{ type: String }] // e.g., 'Projector', 'Lab Equipment'
}, { timestamps: true });

export default mongoose.model('Classroom', classroomSchema);
