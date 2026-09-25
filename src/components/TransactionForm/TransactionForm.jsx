import React, { useState, useEffect } from 'react';
import styles from './TransactionForm.module.css';

// Fallback-категории (будут заменены на импорт из constants.js в фазе E)
const FALLBACK_INCOME_CATEGORIES = [
  { id: 'salary', label: 'Зарплата' },
  { id: 'freelance', label: 'Подработка' },
  { id: 'bonus', label: 'Премия' },
  { id: 'debt_return', label: 'Возврат долга' },
  { id: 'deposit_interest', label: 'Проценты по вкладу' },
  { id: 'gift', label: 'Подарок' },
  { id: 'other', label: 'Прочее' },
];

const FALLBACK_EXPENSE_CATEGORIES = [
  { id: 'groceries', label: 'Продукты' },
  { id: 'utilities', label: 'Коммуналка' },
  { id: 'rent', label: 'Аренда' },
  { id: 'subscriptions', label: 'Подписки' },
  { id: 'transport', label: 'Транспорт' },
  { id: 'health', label: 'Здоровье' },
  { id: 'clothing', label: 'Одежда' },
  { id: 'entertainment', label: 'Развлечения' },
  { id: 'communication', label: 'Связь' },
  { id: 'other', label: 'Прочее' },
];

// Форматирование даты в YYYY-MM-DD для input type="date"
const formatDateForInput = (date) => {
  if (!date) {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  if (typeof date === 'string' && date.length === 10) return date;
  const d = new Date(date);
  if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
  return d.toISOString().split('T')[0];
};

function TransactionForm({ onSubmit, onCancel, editData }) {
  // Начальные значения: либо из editData, либо дефолтные
  const [type, setType] = useState(editData?.type ?? 'expense');
  const [category, setCategory] = useState(editData?.category ?? '');
  const [amount, setAmount] = useState(editData?.amount?.toString() ?? '');
  const [date, setDate] = useState(formatDateForInput(editData?.date));
  const [comment, setComment] = useState(editData?.comment ?? '');
  const [error, setError] = useState('');

  // Список категорий в зависимости от типа операции
  const categories = type === 'income'
    ? FALLBACK_INCOME_CATEGORIES
    : FALLBACK_EXPENSE_CATEGORIES;

  // При смене типа — сбрасываем категорию, если её нет в новом списке
  useEffect(() => {
    const categoryExists = categories.some((c) => c.id === category);
    if (!categoryExists) {
      setCategory(categories[0]?.id ?? '');
    }
  }, [type]); // eslint-disable-line react-hooks/exhaustive-deps

  // Обработчик смены типа операции
  const handleTypeChange = (newType) => {
    setType(newType);
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Валидация
    const numericAmount = parseFloat(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setError('Укажите корректную сумму (больше 0)');
      return;
    }
    if (!category) {
      setError('Выберите категорию');
      return;
    }
    if (!date) {
      setError('Укажите дату');
      return;
    }

    // Формируем объект операции
    const transaction = {
      id: editData?.id, // если редактируем — сохраняем id
      type,
      category,
      amount: numericAmount,
      date,
      comment: comment.trim(),
    };

    onSubmit?.(transaction);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Переключатель типа операции */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Тип операции</label>
        <div className={styles.typeSwitcher}>
          <button
            type="button"
            className={`${styles.typeButton} ${type === 'income' ? styles.typeButtonActiveIncome : ''}`}
            onClick={() => handleTypeChange('income')}
          >
            💰 Доход
          </button>
          <button
            type="button"
            className={`${styles.typeButton} ${type === 'expense' ? styles.typeButtonActiveExpense : ''}`}
            onClick={() => handleTypeChange('expense')}
          >
            💸 Расход
          </button>
        </div>
      </div>

      {/* Сетка полей */}
      <div className={styles.grid}>
        {/* Категория */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Категория</label>
          <select
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {(categories || []).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Сумма */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Сумма (₽)</label>
          <input
            type="number"
            className={styles.input}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            min="0"
            step="0.01"
          />
        </div>

        {/* Дата */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Дата</label>
          <input
            type="date"
            className={styles.input}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* Комментарий */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Комментарий</label>
        <textarea
          className={styles.textarea}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Необязательное примечание к операции"
        />
      </div>

      {/* Сообщение об ошибке */}
      {error && (
        <div style={{
          color: 'var(--color-danger)',
          fontSize: 'var(--font-size-sm)',
          padding: 'var(--spacing-sm)',
          backgroundColor: '#fef2f2',
          borderRadius: 'var(--border-radius)'
        }}>
          {error}
        </div>
      )}

      {/* Кнопки действий */}
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.button} ${styles.buttonSecondary}`}
          onClick={() => onCancel?.()}
        >
          Отмена
        </button>
        <button
          type="submit"
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          {editData ? 'Сохранить изменения' : 'Добавить операцию'}
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;