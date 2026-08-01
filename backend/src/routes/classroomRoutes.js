import express from 'express';
import { getClassrooms, createClassroom, deleteClassroom, updateClassroom } from '../controllers/classroomController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getClassrooms)
  .post(protect, adminOnly, createClassroom);

router.route('/:id')
  .put(protect, adminOnly, updateClassroom)
  .delete(protect, adminOnly, deleteClassroom);

export default router;
