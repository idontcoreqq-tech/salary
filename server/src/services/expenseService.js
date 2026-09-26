import crypto from 'crypto';
import db from '../db/connection.js';
import { createError } from '../middleware/errorHandler.js';

// Преобразование строки из БД (snake_case) в объект для API (camelCase)
// INTEGER is_recurring в SQLite → boolean в JSON
const mapRowToCamel = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    amount: row.amount,
    date: row.date,
    category: row.category,
    comment: row.comment || '',
    isRecurring: Boolean(row.is_recurring),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

// Получение списка расходов с пагинацией и фильтрами
export const getAllExpenses = ({ page = 1, limit = 20, category, dateFrom, dateTo, isRecurring } = {}) => {
  const conditions = [];
  const params = [];

  // Фильтр по категории
  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }

  // Фильтр по дате "от"
  if (dateFrom) {
    conditions.push('date >= ?');
    params.push(dateFrom);
  }

  // Фильтр по дате "до"
  if (dateTo) {
    conditions.push('date <= ?');
    params.push(dateTo);
  }

  // Фильтр по признаку регулярности
  if (isRecurring !== undefined) {
    conditions.push('is_recurring = ?');
    params.push(isRecurring ? 1 : 0);
  }

  // Формируем WHERE-часть
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Получаем общее количество записей для пагинации
  const countQuery = `SELECT COUNT(*) as total FROM expenses ${whereClause}`;
  const { total } = db.prepare(countQuery).get(...params);

  // Вычисляем OFFSET
  const offset = (page - 1) * limit;

  // Получаем данные с пагинацией
  const dataQuery = `
    SELECT * FROM expenses 
    ${whereClause}
    ORDER BY date DESC, created_at DESC
    LIMIT ? OFFSET ?
  `;
  const rows = db.prepare(dataQuery).all(...params, limit, offset);

  return {
    data: rows.map(mapRowToCamel),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Получение расхода по ID
export const getExpenseById = (id) => {
  const row = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
  if (!row) {
    throw createError.notFound(`Расход с ID "${id}" не найден`);
  }
  return mapRowToCamel(row);
};

// Создание нового расхода
export const createExpense = ({ amount, date, category, comment = '', isRecurring = false }) => {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const query = `
    INSERT INTO expenses (id, amount, date, category, comment, is_recurring, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.prepare(query).run(id, amount, date, category, comment, isRecurring ? 1 : 0, now, now);

  return getExpenseById(id);
};

// Обновление расхода
export const updateExpense = (id, { amount, date, category, comment, isRecurring }) => {
  // Проверяем, что расход существует
  const existing = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
  if (!existing) {
    throw createError.notFound(`Расход с ID "${id}" не найден`);
  }

  const now = new Date().toISOString();
  const query = `
    UPDATE expenses
    SET amount = ?, date = ?, category = ?, comment = ?, is_recurring = ?, updated_at = ?
    WHERE id = ?
  `;

  db.prepare(query).run(
    amount ?? existing.amount,
    date ?? existing.date,
    category ?? existing.category,
    comment ?? existing.comment,
    isRecurring !== undefined ? (isRecurring ? 1 : 0) : existing.is_recurring,
    now,
    id
  );

  return getExpenseById(id);
};

// Удаление расхода
export const deleteExpense = (id) => {
  const result = db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
  if (result.changes === 0) {
    throw createError.notFound(`Расход с ID "${id}" не найден`);
  }
  return { success: true, id };
};