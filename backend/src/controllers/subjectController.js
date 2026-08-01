import Subject from '../models/Subject.js';

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({}).populate('facultyId', 'name email');
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSubject = async (req, res) => {
  try {
    const count = await Subject.countDocuments({});
    if (count >= 7) {
      return res.status(400).json({ message: 'Subject limit reached (maximum 7 subjects allowed).' });
    }

    const { name, code, facultyId, hoursPerWeek } = req.body;
    const subject = new Subject({ name, code, facultyId, hoursPerWeek });
    const createdSubject = await subject.save();
    res.status(201).json(createdSubject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { name, code, facultyId, hoursPerWeek } = req.body;
    const subject = await Subject.findById(req.params.id);

    if (subject) {
      subject.name = name || subject.name;
      subject.code = code || subject.code;
      subject.facultyId = facultyId || subject.facultyId;
      subject.hoursPerWeek = hoursPerWeek || subject.hoursPerWeek;

      const updatedSubject = await subject.save();
      res.json(updatedSubject);
    } else {
      res.status(404).json({ message: 'Subject not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (subject) {
      await subject.deleteOne();
      res.json({ message: 'Subject removed' });
    } else {
      res.status(404).json({ message: 'Subject not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
