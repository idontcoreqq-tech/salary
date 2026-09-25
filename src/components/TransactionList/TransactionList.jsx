import React from 'react';
import EmptyState from '../EmptyState/EmptyState';
import styles from './TransactionList.module.css';

function TransactionList({ transactions = [], onEdit, onDelete }) {
  // Если список пуст — показываем заглушку
  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="Нет операций"
        description="Добавьте первую операцию, чтобы увидеть её здесь"
      />
    );
  }

  return (
    <div className={styles.list}>
      {/* Заголовок таблицы */}
      <div className={styles.header}>
        <div>Дата</div>
        <div>Категория</div>
        <div>Комментарий</div>
        <div style={{ textAlign: 'right' }}>Сумма</div>
        <div style={{ textAlign: 'right' }}>Действия</div>
      </div>

      {/* Строки операций */}
      {(transactions || []).map((transaction) => {
        const isIncome = transaction.type === 'income';
        const amountClass = isIncome ? styles.amountIncome : styles.amountExpense;
        const sign = isIncome ? '+' : '-';
        const formattedAmount = Math.abs(transaction.amount ?? 0).toLocaleString('ru-RU');

        return (
          <div key={transaction.id} className={styles.row}>
            {/* Дата */}
            <div className={`${styles.cell} ${styles.date}`} data-label="Дата">
              {transaction.date ?? '—'}
            </div>

            {/* Категория */}
            <div className={`${styles.cell} ${styles.category}`} data-label="Категория">
              <span className={styles.categoryIcon}>
                {isIncome ? '💰' : '💸'}
              </span>
              <span className={styles.categoryName}>
                {transaction.categoryLabel ?? transaction.category ?? 'Без категории'}
              </span>
            </div>

            {/* Комментарий */}
            <div className={`${styles.cell} ${styles.comment}`} data-label="Комментарий">
              {transaction.comment || '—'}
            </div>

            {/* Сумма */}
            <div className={`${styles.cell} ${styles.amount} ${amountClass}`} data-label="Сумма">
              {sign}{formattedAmount} ₽
            </div>

            {/* Действия */}
            <div className={`${styles.cell} ${styles.actions}`} data-label="Действия">
              {onEdit && (
                <button
                  className={`${styles.actionButton} ${styles.editButton}`}
                  onClick={() => onEdit(transaction)}
                  title="Редактировать"
                >
                  ✏️
                </button>
              )}
              {onDelete && (
                <button
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={() => onDelete(transaction.id)}
                  title="Удалить"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TransactionList;