import React, { useState, useEffect, useCallback } from 'react';
import BalanceCard from '../../components/BalanceCard/BalanceCard';
import TransactionList from '../../components/TransactionList/TransactionList';
import Modal from '../../components/Modal/Modal';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import { getBalance, getRecentTransactions, getCategoryLabel } from '../../services/summaryService';
import { addIncome } from '../../services/incomeService';
import { addExpense } from '../../services/expenseService';
import styles from './Dashboard.module.css';

function Dashboard() {
  // Состояние для данных
  const [balanceData, setBalanceData] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Функция загрузки данных
  const loadData = useCallback(() => {
    const balance = getBalance();
    setBalanceData(balance);

    const recent = getRecentTransactions(10);
    // Добавляем названия категорий к транзакциям
    const enriched = recent.map((t) => ({
      ...t,
      categoryLabel: getCategoryLabel(t.category, t.type),
    }));
    setRecentTransactions(enriched);
  }, []);

  // Загружаем данные при монтировании
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Обработчик отправки формы
  const handleFormSubmit = (transaction) => {
    if (transaction.type === 'income') {
      addIncome(transaction);
    } else {
      addExpense(transaction);
    }

    setIsModalOpen(false);
    // Перезагружаем данные после добавления
    loadData();
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Обзор финансов</h1>

      {/* Сетка карточек баланса */}
      <div className={styles.cardsGrid}>
        <BalanceCard
          title="Баланс"
          amount={balanceData.balance ?? 0}
          color="balance"
        />
        <BalanceCard
          title="Доходы"
          amount={balanceData.totalIncome ?? 0}
          color="income"
        />
        <BalanceCard
          title="Расходы"
          amount={balanceData.totalExpense ?? 0}
          color="expense"
        />
      </div>

      {/* Секция последних операций */}
      <div className={styles.recentSection}>
        <h2 className={styles.sectionTitle}>Последние операции</h2>
        <TransactionList transactions={recentTransactions} />
      </div>

      {/* Плавающая кнопка добавления */}
      <button
        className={styles.addButton}
        title="Добавить операцию"
        onClick={() => setIsModalOpen(true)}
      >
        +
      </button>

      {/* Модалка с формой добавления операции */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Новая операция"
      >
        <TransactionForm
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default Dashboard;