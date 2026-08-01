import express from 'express';
import { exportPDF, exportExcel } from '../controllers/exportController.js';

const router = express.Router();

router.get('/:id/pdf', exportPDF);
router.get('/:id/excel', exportExcel);

export default router;
