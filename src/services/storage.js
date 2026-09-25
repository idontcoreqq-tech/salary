// Генерация уникального идентификатора
export const generateId = () => {
  try {
    // Используем встроенный метод, если доступен
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback для старых браузеров
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  } catch (error) {
    console.error('Ошибка генерации ID:', error);
    return Date.now().toString();
  }
};

// Безопасное получение данных из localStorage
export const storageGet = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    
    const parsed = JSON.parse(item);
    return parsed;
  } catch (error) {
    console.error(`Ошибка чтения из localStorage (ключ: ${key}):`, error);
    return null;
  }
};

// Безопасная запись данных в localStorage
export const storageSet = (key, value) => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Ошибка записи в localStorage (ключ: ${key}):`, error);
    return false;
  }
};

// Удаление данных из localStorage
export const storageRemove = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Ошибка удаления из localStorage (ключ: ${key}):`, error);
    return false;
  }
};

// Очистка всего localStorage
export const storageClear = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Ошибка очистки localStorage:', error);
    return false;
  }
};