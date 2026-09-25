import React from 'react';
import styles from './BalanceCard.module.css';

function BalanceCard({ title = '', amount = 0, color = 'balance' }) {
  // Форматирование суммы с разделителями тысяч
  const formattedAmount = Math.abs(amount).toLocaleString('ru-RU');
  
  // Добавление знака в зависимости от типа
  const displayAmount = color === 'income' 
    ? `+${formattedAmount} ₽` 
    : color === 'expense' 
    ? `-${formattedAmount} ₽` 
    : `${formattedAmount} ₽`;

  // Динамический класс в зависимости от цвета
  const cardClass = `${styles.card} ${styles[color] || styles.balance}`;

  return (
    <div className={cardClass}>
      <div className={styles.title}>{title}</div>
      <div className={styles.amount}>{displayAmount}</div>
    </div>
  );
}

export default BalanceCard;