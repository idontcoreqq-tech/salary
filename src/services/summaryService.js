import { getIncomes } from './incomeService';
import { getExpenses } from './expenseService';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/constants';

// Получение всех операций (доходы + расходы)
export const getAllTransactions = () => {
  const incomes = getIncomes();
  const expenses = getExpenses();
  
  // Объединяем и сортируем по дате (новые сначала)
  const allTransactions = [...incomes, ...expenses].sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime();
    const dateB = new Date(b.date || 0).getTime();
    return dateB - dateA; // обратный порядок
  });
  
  return allTransactions;
};

// Получение последних N операций
export const getRecentTransactions = (limit = 10) => {
  const all = getAllTransactions();
  return all.slice(0, limit);
};

// Подсчет общего баланса
export const getBalance = () => {
  const incomes = getIncomes();
  const expenses = getExpenses();
  
  const totalIncome = incomes.reduce((sum, inc) => sum + (Number(inc.amount) || 0), 0);
  const totalExpense = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  
  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
};

// Получение данных для круговой диаграммы (расходы по категориям)
export const getExpensesByCategory = () => {
  const expenses = getExpenses();
  
  // Группируем суммы по категориям
  const categoryMap = {};
  expenses.forEach((exp) => {
    const category = exp.category || 'other';
    const amount = Number(exp.amount) || 0;
    categoryMap[category] = (categoryMap[category] || 0) + amount;
  });
  
  // Преобразуем в массив для PieChart
  const data = Object.entries(categoryMap).map(([categoryId, value]) => {
    const categoryObj = EXPENSE_CATEGORIES.find((c) => c.id === categoryId);
    return {
      name: categoryObj?.label || 'Прочее',
      value,
    };
  });
  
  // Сортируем по убыванию суммы
  return data.sort((a, b) => b.value - a.value);
};

// Получение данных для столбчатого графика (доходы и расходы по месяцам)
export const getMonthlySummary = () => {
  const incomes = getIncomes();
  const expenses = getExpenses();
  
  // Группируем по месяцу (YYYY-MM)
  const monthlyMap = {};
  
  incomes.forEach((inc) => {
    if (!inc.date) return;
    const monthKey = inc.date.substring(0, 7); // "2026-09"
    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { income: 0, expense: 0 };
    }
    monthlyMap[monthKey].income += Number(inc.amount) || 0;
  });
  
  expenses.forEach((exp) => {
    if (!exp.date) return;
    const monthKey = exp.date.substring(0, 7); // "2026-09"
    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { income: 0, expense: 0 };
    }
    monthlyMap[monthKey].expense += Number(exp.amount) || 0;
  });
  
  // Преобразуем в массив для BarChart
  const data = Object.entries(monthlyMap)
    .map(([monthKey, values]) => {
      // Извлекаем номер месяца для сортировки
      const monthNumber = parseInt(monthKey.split('-')[1], 10);
      const monthNames = [
        'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
        'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
      ];
      
      return {
        month: monthNames[monthNumber - 1] || monthKey,
        income: values.income,
        expense: values.expense,
        monthNumber, // для сортировки
      };
    })
    .sort((a, b) => a.monthNumber - b.monthNumber); // сортируем по возрастанию месяца
  
  return data;
};

// Получение названия категории по ID
export const getCategoryLabel = (categoryId, type) => {
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const category = categories.find((c) => c.id === categoryId);
  return category?.label || 'Без категории';
};