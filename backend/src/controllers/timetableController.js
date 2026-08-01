import Timetable from '../models/Timetable.js';
import Classroom from '../models/Classroom.js';
import Subject from '../models/Subject.js';
import LabSession from '../models/LabSession.js';
import { generateTimetable } from '../utils/scheduler.js';

export const triggerTimetableGeneration = async (req, res) => {
  try {
    const { title } = req.body;
    
    // Fetch all resources needed for the algorithm
    const classrooms = await Classroom.find({});
    // Subjects populated with faculty details
    const subjects = await Subject.find({}).populate('facultyId');
    const labs = await LabSession.find({}).populate('facultyId');

    // Call the solver
    const result = generateTimetable(classrooms, subjects, labs);

    if (result.schedule.length === 0) {
      return res.status(400).json({ message: 'Could not generate any schedule with given constraints.' });
    }

    // Save to DB
    const newTimetable = new Timetable({
      title: title || `Generated Schedule ${new Date().toISOString()}`,
      schedule: result.schedule
    });

    const saved = await newTimetable.save();
    
    res.status(201).json({
      message: 'Timetable generated successfully!',
      unassignedSubjects: result.unassigned,
      data: saved
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find({})
      .populate('schedule.subjectId', 'name code')
      .populate('schedule.labId', 'name code duration')
      .populate('schedule.classroomId', 'name')
      .populate('schedule.facultyId', 'name email');
    res.json(timetables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    await timetable.deleteOne();
    res.json({ message: 'Timetable removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
