import crypto from 'crypto';
import db from '../db/connection.js';
import { createError } from '../middleware/errorHandler.js';

// Преобразование строки из БД (snake_case) в объект для API (camelCase)
const mapRowToCamel = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    amount: row.amount,
    date: row.date,
    category: row.category,
    comment: row.comment || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

// Получение списка доходов с пагинацией и фильтрами
export const getAllIncomes = ({ page = 1, limit = 20, category, dateFrom, dateTo } = {}) => {
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

  // Формируем WHERE-часть
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Получаем общее количество записей для пагинации
  const countQuery = `SELECT COUNT(*) as total FROM incomes ${whereClause}`;
  const { total } = db.prepare(countQuery).get(...params);

  // Вычисляем OFFSET
  const offset = (page - 1) * limit;

  // Получаем данные с пагинацией
  const dataQuery = `
    SELECT * FROM incomes 
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

// Получение дохода по ID
export const getIncomeById = (id) => {
  const row = db.prepare('SELECT * FROM incomes WHERE id = ?').get(id);
  if (!row) {
    throw createError.notFound(`Доход с ID "${id}" не найден`);
  }
  return mapRowToCamel(row);
};

// Создание нового дохода
export const createIncome = ({ amount, date, category, comment = '' }) => {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const query = `
    INSERT INTO incomes (id, amount, date, category, comment, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.prepare(query).run(id, amount, date, category, comment, now, now);

  return getIncomeById(id);
};

// Обновление дохода
export const updateIncome = (id, { amount, date, category, comment }) => {
  // Проверяем, что доход существует
  const existing = db.prepare('SELECT * FROM incomes WHERE id = ?').get(id);
  if (!existing) {
    throw createError.notFound(`Доход с ID "${id}" не найден`);
  }

  const now = new Date().toISOString();
  const query = `
    UPDATE incomes
    SET amount = ?, date = ?, category = ?, comment = ?, updated_at = ?
    WHERE id = ?
  `;

  db.prepare(query).run(
    amount ?? existing.amount,
    date ?? existing.date,
    category ?? existing.category,
    comment ?? existing.comment,
    now,
    id
  );

  return getIncomeById(id);
};

// Удаление дохода
export const deleteIncome = (id) => {
  const result = db.prepare('DELETE FROM incomes WHERE id = ?').run(id);
  if (result.changes === 0) {
    throw createError.notFound(`Доход с ID "${id}" не найден`);
  }
  return { success: true, id };
};