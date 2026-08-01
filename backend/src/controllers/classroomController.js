import Classroom from '../models/Classroom.js';

export const getClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find({});
    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createClassroom = async (req, res) => {
  try {
    const { name, capacity, features } = req.body;
    const classroom = new Classroom({ name, capacity, features });
    const createdClassroom = await classroom.save();
    res.status(201).json(createdClassroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (classroom) {
      await classroom.deleteOne();
      res.json({ message: 'Classroom removed' });
    } else {
      res.status(404).json({ message: 'Classroom not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateClassroom = async (req, res) => {
  try {
    const { name, capacity, features } = req.body;
    const classroom = await Classroom.findById(req.params.id);
    
    if (classroom) {
      classroom.name = name || classroom.name;
      classroom.capacity = capacity || classroom.capacity;
      classroom.features = features || classroom.features;
      
      const updatedClassroom = await classroom.save();
      res.json(updatedClassroom);
    } else {
      res.status(404).json({ message: 'Classroom not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
