import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hoursPerWeek: { type: Number, required: true, default: 3, max: 3 }
}, { timestamps: true });

export default mongoose.model('Subject', subjectSchema);
