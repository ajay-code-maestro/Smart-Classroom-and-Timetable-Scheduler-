import express from 'express';
import { getSubjects, createSubject, deleteSubject, updateSubject } from '../controllers/subjectController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getSubjects)
  .post(protect, adminOnly, createSubject);

router.route('/:id')
  .put(protect, adminOnly, updateSubject)
  .delete(protect, adminOnly, deleteSubject);

export default router;
