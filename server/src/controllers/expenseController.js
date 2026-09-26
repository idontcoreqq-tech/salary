import * as expenseService from '../services/expenseService.js';

// GET /expenses — получение списка расходов с пагинацией и фильтрами
export const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, dateFrom, dateTo, isRecurring } = req.query;

    // Преобразуем isRecurring из строки в boolean
    let isRecurringBool;
    if (isRecurring !== undefined) {
      isRecurringBool = isRecurring === 'true';
    }

    const result = expenseService.getAllExpenses({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      category,
      dateFrom,
      dateTo,
      isRecurring: isRecurringBool,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// GET /expenses/:id — получение расхода по ID
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const expense = expenseService.getExpenseById(id);
    res.json(expense);
  } catch (error) {
    next(error);
  }
};

// POST /expenses — создание нового расхода
export const create = async (req, res, next) => {
  try {
    const { amount, date, category, comment, isRecurring } = req.body;

    const newExpense = expenseService.createExpense({
      amount: Number(amount),
      date,
      category,
      comment: comment || '',
      isRecurring: Boolean(isRecurring),
    });

    res.status(201).json(newExpense);
  } catch (error) {
    next(error);
  }
};

// PUT /expenses/:id — обновление расхода
export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, date, category, comment, isRecurring } = req.body;

    const updatedExpense = expenseService.updateExpense(id, {
      amount: amount !== undefined ? Number(amount) : undefined,
      date,
      category,
      comment,
      isRecurring: isRecurring !== undefined ? Boolean(isRecurring) : undefined,
    });

    res.json(updatedExpense);
  } catch (error) {
    next(error);
  }
};

// DELETE /expenses/:id — удаление расхода
export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = expenseService.deleteExpense(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};