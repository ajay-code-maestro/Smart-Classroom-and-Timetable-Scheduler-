import mongoose from 'mongoose';

const timetableEntrySchema = new mongoose.Schema({
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  labId: { type: mongoose.Schema.Types.ObjectId, ref: 'LabSession' },
  classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const timetableSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., 'Spring 2026 CS Dept'
  targetDepartment: { type: String }, // Optional categorization
  targetSemester: { type: String },
  schedule: [timetableEntrySchema]
}, { timestamps: true });

export default mongoose.model('Timetable', timetableSchema);
