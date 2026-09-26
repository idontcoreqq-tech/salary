import * as incomeService from '../services/incomeService.js';

// GET /incomes — получение списка доходов с пагинацией и фильтрами
export const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, dateFrom, dateTo } = req.query;

    const result = incomeService.getAllIncomes({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      category,
      dateFrom,
      dateTo,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// GET /incomes/:id — получение дохода по ID
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const income = incomeService.getIncomeById(id);
    res.json(income);
  } catch (error) {
    next(error);
  }
};

// POST /incomes — создание нового дохода
export const create = async (req, res, next) => {
  try {
    const { amount, date, category, comment } = req.body;

    const newIncome = incomeService.createIncome({
      amount: Number(amount),
      date,
      category,
      comment: comment || '',
    });

    res.status(201).json(newIncome);
  } catch (error) {
    next(error);
  }
};

// PUT /incomes/:id — обновление дохода
export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, date, category, comment } = req.body;

    const updatedIncome = incomeService.updateIncome(id, {
      amount: amount !== undefined ? Number(amount) : undefined,
      date,
      category,
      comment,
    });

    res.json(updatedIncome);
  } catch (error) {
    next(error);
  }
};

// DELETE /incomes/:id — удаление дохода
export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = incomeService.deleteIncome(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};