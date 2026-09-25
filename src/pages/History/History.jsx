import React, { useState, useEffect, useCallback } from 'react';
import TransactionList from '../../components/TransactionList/TransactionList';
import Modal from '../../components/Modal/Modal';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import { getAllTransactions, getCategoryLabel } from '../../services/summaryService';
import { addIncome, updateIncome, deleteIncome } from '../../services/incomeService';
import { addExpense, updateExpense, deleteExpense } from '../../services/expenseService';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/constants';
import { formatDateShort } from '../../utils/formatters';
import styles from './History.module.css';

function History() {
  // Состояния фильтров
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Состояние данных
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // Состояние модалки
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Загрузка всех транзакций
  const loadData = useCallback(() => {
    const transactions = getAllTransactions();
    // Добавляем названия категорий и форматируем даты
    const enriched = transactions.map((t) => ({
      ...t,
      categoryLabel: getCategoryLabel(t.category, t.type),
      dateFormatted: formatDateShort(t.date),
    }));
    setAllTransactions(enriched);
  }, []);

  // Загружаем данные при монтировании
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Применение фильтров
  useEffect(() => {
    let filtered = [...allTransactions];

    // Фильтр по типу
    if (typeFilter !== 'all') {
      filtered = filtered.filter((t) => t.type === typeFilter);
    }

    // Фильтр по категории
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((t) => t.category === categoryFilter);
    }

    // Фильтр по дате "с"
    if (dateFrom) {
      filtered = filtered.filter((t) => t.date >= dateFrom);
    }

    // Фильтр по дате "по"
    if (dateTo) {
      filtered = filtered.filter((t) => t.date <= dateTo);
    }

    setFilteredTransactions(filtered);
  }, [allTransactions, typeFilter, categoryFilter, dateFrom, dateTo]);

  // Сброс фильтров
  const handleResetFilters = () => {
    setTypeFilter('all');
    setCategoryFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  // Открытие модалки для добавления
  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  // Открытие модалки для редактирования
  const handleOpenEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  // Закрытие модалки
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  // Обработчик отправки формы
  const handleFormSubmit = (transaction) => {
    if (editingTransaction) {
      // Режим редактирования
      if (transaction.type === 'income') {
        updateIncome(transaction.id, transaction);
      } else {
        updateExpense(transaction.id, transaction);
      }
    } else {
      // Режим добавления
      if (transaction.type === 'income') {
        addIncome(transaction);
      } else {
        addExpense(transaction);
      }
    }

    handleCloseModal();
    loadData(); // Перезагружаем данные
  };

  // Обработчик удаления
  const handleDelete = (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить эту операцию?');
    if (!confirmed) return;

    // Определяем тип операции по ID
    const transaction = allTransactions.find((t) => t.id === id);
    if (!transaction) return;

    if (transaction.type === 'income') {
      deleteIncome(id);
    } else {
      deleteExpense(id);
    }

    loadData(); // Перезагружаем данные
  };

  // Список категорий для фильтра (объединяем доходы и расходы)
  const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

  return (
    <div className={styles.history}>
      {/* Заголовок и кнопка добавления */}
      <div className={styles.header}>
        <h1 className={styles.title}>История операций</h1>
        <button className={styles.addButton} onClick={handleOpenAddModal}>
          + Добавить операцию
        </button>
      </div>

      {/* Панель фильтров */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Тип операции</label>
          <select
            className={styles.filterSelect}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">Все</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Категория</label>
          <select
            className={styles.filterSelect}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Все категории</option>
            {(allCategories || []).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Дата с</label>
          <input
            type="date"
            className={styles.filterInput}
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Дата по</label>
          <input
            type="date"
            className={styles.filterInput}
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        <button className={styles.resetButton} onClick={handleResetFilters}>
          Сбросить фильтры
        </button>
      </div>

      {/* Список операций */}
      <div className={styles.listContainer}>
        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      </div>

      {/* Модалка с формой */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTransaction ? 'Редактировать операцию' : 'Новая операция'}
      >
        <TransactionForm
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          editData={editingTransaction}
        />
      </Modal>
    </div>
  );
}

export default History;