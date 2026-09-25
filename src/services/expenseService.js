import { storageGet, storageSet, generateId } from './storage';

// Ключ для хранения расходов в localStorage
const STORAGE_KEY = 'expenses';

// Получение всех расходов
export const getExpenses = () => {
  const expenses = storageGet(STORAGE_KEY);
  return Array.isArray(expenses) ? expenses : [];
};

// Получение расхода по ID
export const getExpenseById = (id) => {
  const expenses = getExpenses();
  return expenses.find((expense) => expense.id === id) || null;
};

// Добавление нового расхода
export const addExpense = (expenseData) => {
  const expenses = getExpenses();
  
  const newExpense = {
    id: generateId(),
    type: 'expense',
    category: expenseData.category || '',
    amount: Number(expenseData.amount) || 0,
    date: expenseData.date || new Date().toISOString().split('T')[0],
    comment: expenseData.comment || '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  expenses.push(newExpense);
  storageSet(STORAGE_KEY, expenses);
  
  return newExpense;
};

// Обновление существующего расхода
export const updateExpense = (id, expenseData) => {
  const expenses = getExpenses();
  const index = expenses.findIndex((expense) => expense.id === id);
  
  if (index === -1) {
    console.error(`Расход с ID ${id} не найден`);
    return null;
  }
  
  const updatedExpense = {
    ...expenses[index],
    category: expenseData.category ?? expenses[index].category,
    amount: Number(expenseData.amount) ?? expenses[index].amount,
    date: expenseData.date ?? expenses[index].date,
    comment: expenseData.comment ?? expenses[index].comment,
    updatedAt: Date.now(),
  };
  
  expenses[index] = updatedExpense;
  storageSet(STORAGE_KEY, expenses);
  
  return updatedExpense;
};

// Удаление расхода
export const deleteExpense = (id) => {
  const expenses = getExpenses();
  const filteredExpenses = expenses.filter((expense) => expense.id !== id);
  
  if (filteredExpenses.length === expenses.length) {
    console.error(`Расход с ID ${id} не найден`);
    return false;
  }
  
  storageSet(STORAGE_KEY, filteredExpenses);
  return true;
};