// Форматирование даты из YYYY-MM-DD в читаемый вид
// Например: "2026-09-25" -> "25 сентября 2026"
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  } catch (error) {
    return '—';
  }
};

// Форматирование даты для отображения в коротком виде
// Например: "2026-09-25" -> "25.09.2026"
export const formatDateShort = (dateString) => {
  if (!dateString) return '—';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
  } catch (error) {
    return '—';
  }
};

// Форматирование валюты с разделителями тысяч
// Например: 15000 -> "15 000 ₽"
export const formatCurrency = (amount) => {
  const numericAmount = Number(amount) || 0;
  return `${numericAmount.toLocaleString('ru-RU')} ₽`;
};

// Форматирование валюты с знаком
// Например: formatCurrencyWithSign(15000, 'income') -> "+15 000 ₽"
// formatCurrencyWithSign(15000, 'expense') -> "-15 000 ₽"
export const formatCurrencyWithSign = (amount, type) => {
  const numericAmount = Math.abs(Number(amount) || 0);
  const formatted = numericAmount.toLocaleString('ru-RU');
  const sign = type === 'income' ? '+' : '-';
  return `${sign}${formatted} ₽`;
};

// Получение названия месяца по номеру (1-12)
// Например: getMonthName(9) -> "Сентябрь"
export const getMonthName = (monthNumber) => {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  
  const index = Number(monthNumber) - 1;
  if (index < 0 || index > 11) return '—';
  
  return months[index];
};

// Получение короткого названия месяца
// Например: getMonthNameShort(9) -> "Сен"
export const getMonthNameShort = (monthNumber) => {
  const months = [
    'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
    'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
  ];
  
  const index = Number(monthNumber) - 1;
  if (index < 0 || index > 11) return '—';
  
  return months[index];
};