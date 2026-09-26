import { Router } from 'express';
import * as summaryController from '../controllers/summaryController.js';

const router = Router();

// GET /balance — получение общего баланса
router.get('/balance', summaryController.getBalance);

// GET /by-category — получение расходов по категориям
router.get('/by-category', summaryController.getByCategory);

// GET /by-month — получение доходов и расходов по месяцам
router.get('/by-month', summaryController.getByMonth);

export default router;