import db from '../db/connection.js';
import { EXPENSE_CATEGORIES } from '../utils/categories.js';

// Получение общего баланса: сумма доходов, сумма расходов, итоговый баланс
export const getBalance = () => {
  const incomeQuery = 'SELECT COALESCE(SUM(amount), 0) as total FROM incomes';
  const expenseQuery = 'SELECT COALESCE(SUM(amount), 0) as total FROM expenses';

  const { total: totalIncome } = db.prepare(incomeQuery).get();
  const { total: totalExpense } = db.prepare(expenseQuery).get();

  return {
    totalIncome: Number(totalIncome),
    totalExpense: Number(totalExpense),
    balance: Number(totalIncome) - Number(totalExpense),
  };
};

// Получение расходов по категориям (для круговой диаграммы)
// Возвращает массив объектов { category, label, total }
export const getExpensesByCategory = () => {
  const query = `
    SELECT category, SUM(amount) as total
    FROM expenses
    GROUP BY category
    ORDER BY total DESC
  `;

  const rows = db.prepare(query).all();

  // Маппим category ID в label из констант
  return rows.map((row) => {
    const categoryObj = EXPENSE_CATEGORIES.find((c) => c.id === row.category);
    return {
      category: row.category,
      label: categoryObj?.label || 'Прочее',
      total: Number(row.total),
    };
  });
};

// Получение доходов и расходов по месяцам (для столбчатого графика)
// Возвращает массив объектов { month, income, expense }
// month в формате "YYYY-MM"
export const getMonthlySummary = () => {
  // Получаем доходы по месяцам
  const incomeQuery = `
    SELECT strftime('%Y-%m', date) as month, SUM(amount) as total
    FROM incomes
    GROUP BY month
    ORDER BY month ASC
  `;

  // Получаем расходы по месяцам
  const expenseQuery = `
    SELECT strftime('%Y-%m', date) as month, SUM(amount) as total
    FROM expenses
    GROUP BY month
    ORDER BY month ASC
  `;

  const incomeRows = db.prepare(incomeQuery).all();
  const expenseRows = db.prepare(expenseQuery).all();

  // Объединяем результаты в одну карту
  const monthlyMap = new Map();

  // Добавляем доходы
  incomeRows.forEach((row) => {
    if (!monthlyMap.has(row.month)) {
      monthlyMap.set(row.month, { month: row.month, income: 0, expense: 0 });
    }
    monthlyMap.get(row.month).income = Number(row.total);
  });

  // Добавляем расходы
  expenseRows.forEach((row) => {
    if (!monthlyMap.has(row.month)) {
      monthlyMap.set(row.month, { month: row.month, income: 0, expense: 0 });
    }
    monthlyMap.get(row.month).expense = Number(row.total);
  });

  // Преобразуем карту в массив и сортируем по месяцу
  return Array.from(monthlyMap.values()).sort((a, b) => a.month.localeCompare(b.month));
};