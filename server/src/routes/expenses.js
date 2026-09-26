import { Router } from 'express';
import { validateTransaction } from '../middleware/validate.js';
import * as expenseController from '../controllers/expenseController.js';

const router = Router();

// GET / — получение списка расходов с пагинацией и фильтрами
router.get('/', expenseController.getAll);

// GET /:id — получение расхода по ID
router.get('/:id', expenseController.getById);

// POST / — создание нового расхода (с валидацией)
router.post('/', validateTransaction('expense'), expenseController.create);

// PUT /:id — обновление расхода (с валидацией)
router.put('/:id', validateTransaction('expense'), expenseController.update);

// DELETE /:id — удаление расхода
router.delete('/:id', expenseController.remove);

export default router;