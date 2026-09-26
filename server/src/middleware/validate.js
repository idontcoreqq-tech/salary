import { getIncomeCategoryIds, getExpenseCategoryIds } from '../utils/categories.js';
import { createError } from './errorHandler.js';

// Регулярное выражение для проверки формата даты YYYY-MM-DD
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Проверка, что дата реальная (например, не 2026-02-30)
const isValidDate = (dateString) => {
  if (!DATE_REGEX.test(dateString)) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.toISOString().startsWith(dateString);
};

// Middleware-фабрика для валидации операций (доход или расход)
// Принимает тип операции ('income' или 'expense') и возвращает middleware
export const validateTransaction = (type) => {
  return (req, res, next) => {
    const { amount, date, category } = req.body;
    const errors = [];

    // Проверка суммы
    const numericAmount = Number(amount);
    if (amount === undefined || amount === null || amount === '') {
      errors.push('Поле "amount" обязательно');
    } else if (isNaN(numericAmount) || numericAmount <= 0) {
      errors.push('Сумма должна быть числом больше 0');
    }

    // Проверка даты
    if (!date) {
      errors.push('Поле "date" обязательно');
    } else if (!isValidDate(date)) {
      errors.push('Дата должна быть в формате YYYY-MM-DD');
    }

    // Проверка категории
    const validCategories = type === 'income'
      ? getIncomeCategoryIds()
      : getExpenseCategoryIds();

    if (!category) {
      errors.push('Поле "category" обязательно');
    } else if (!validCategories.includes(category)) {
      errors.push(`Недопустимая категория "${category}". Допустимые: ${validCategories.join(', ')}`);
    }

    // Если есть ошибки — возвращаем 422
    if (errors.length > 0) {
      return next(createError.validation(errors.join('; ')));
    }

    // Если всё ок — передаём управление следующему middleware/контроллеру
    next();
  };
};

// Middleware для валидации параметров пагинации (page, limit)
export const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10);

  if (req.query.page !== undefined && (isNaN(page) || page < 1)) {
    return next(createError.badRequest('Параметр "page" должен быть числом >= 1'));
  }

  if (req.query.limit !== undefined && (isNaN(limit) || limit < 1 || limit > 100)) {
    return next(createError.badRequest('Параметр "limit" должен быть числом от 1 до 100'));
  }

  next();
};