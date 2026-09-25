import { storageGet, storageSet, generateId } from './storage';

// Ключ для хранения доходов в localStorage
const STORAGE_KEY = 'incomes';

// Получение всех доходов
export const getIncomes = () => {
  const incomes = storageGet(STORAGE_KEY);
  return Array.isArray(incomes) ? incomes : [];
};

// Получение дохода по ID
export const getIncomeById = (id) => {
  const incomes = getIncomes();
  return incomes.find((income) => income.id === id) || null;
};

// Добавление нового дохода
export const addIncome = (incomeData) => {
  const incomes = getIncomes();
  
  const newIncome = {
    id: generateId(),
    type: 'income',
    category: incomeData.category || '',
    amount: Number(incomeData.amount) || 0,
    date: incomeData.date || new Date().toISOString().split('T')[0],
    comment: incomeData.comment || '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  incomes.push(newIncome);
  storageSet(STORAGE_KEY, incomes);
  
  return newIncome;
};

// Обновление существующего дохода
export const updateIncome = (id, incomeData) => {
  const incomes = getIncomes();
  const index = incomes.findIndex((income) => income.id === id);
  
  if (index === -1) {
    console.error(`Доход с ID ${id} не найден`);
    return null;
  }
  
  const updatedIncome = {
    ...incomes[index],
    category: incomeData.category ?? incomes[index].category,
    amount: Number(incomeData.amount) ?? incomes[index].amount,
    date: incomeData.date ?? incomes[index].date,
    comment: incomeData.comment ?? incomes[index].comment,
    updatedAt: Date.now(),
  };
  
  incomes[index] = updatedIncome;
  storageSet(STORAGE_KEY, incomes);
  
  return updatedIncome;
};

// Удаление дохода
export const deleteIncome = (id) => {
  const incomes = getIncomes();
  const filteredIncomes = incomes.filter((income) => income.id !== id);
  
  if (filteredIncomes.length === incomes.length) {
    console.error(`Доход с ID ${id} не найден`);
    return false;
  }
  
  storageSet(STORAGE_KEY, filteredIncomes);
  return true;
};