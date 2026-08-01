import express from 'express';
import LabSession from '../models/LabSession.js';

const router = express.Router();

// Get all labs
router.get('/', async (req, res) => {
  try {
    const labs = await LabSession.find().populate('facultyId', 'name');
    res.json(labs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new lab
router.post('/', async (req, res) => {
  try {
    const count = await LabSession.countDocuments();
    if (count >= 3) {
      return res.status(400).json({ message: 'Maximum limit of 3 labs reached.' });
    }
    const newLab = new LabSession(req.body);
    await newLab.save();
    res.status(201).json(newLab);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update lab
router.put('/:id', async (req, res) => {
  try {
    const lab = await LabSession.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(lab);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete lab
router.delete('/:id', async (req, res) => {
  try {
    await LabSession.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lab session deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
