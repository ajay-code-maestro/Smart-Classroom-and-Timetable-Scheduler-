import express from 'express';
import { triggerTimetableGeneration, getTimetables, deleteTimetable } from '../controllers/timetableController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getTimetables);
router.post('/generate', protect, adminOnly, triggerTimetableGeneration);
router.delete('/:id', protect, adminOnly, deleteTimetable);

export default router;
