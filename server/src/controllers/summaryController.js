import * as summaryService from '../services/summaryService.js';

// GET /summary/balance — получение общего баланса
export const getBalance = async (req, res, next) => {
  try {
    const balance = summaryService.getBalance();
    res.json(balance);
  } catch (error) {
    next(error);
  }
};

// GET /summary/by-category — получение расходов по категориям
export const getByCategory = async (req, res, next) => {
  try {
    const data = summaryService.getExpensesByCategory();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

// GET /summary/by-month — получение доходов и расходов по месяцам
export const getByMonth = async (req, res, next) => {
  try {
    const data = summaryService.getMonthlySummary();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};