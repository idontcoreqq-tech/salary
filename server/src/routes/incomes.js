import { Router } from 'express';
import { validateTransaction } from '../middleware/validate.js';
import * as incomeController from '../controllers/incomeController.js';

const router = Router();

// GET / — получение списка доходов с пагинацией и фильтрами
router.get('/', incomeController.getAll);

// GET /:id — получение дохода по ID
router.get('/:id', incomeController.getById);

// POST / — создание нового дохода (с валидацией)
router.post('/', validateTransaction('income'), incomeController.create);

// PUT /:id — обновление дохода (с валидацией)
router.put('/:id', validateTransaction('income'), incomeController.update);

// DELETE /:id — удаление дохода
router.delete('/:id', incomeController.remove);

export default router;