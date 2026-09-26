// Кастомный класс ошибки с HTTP-кодом и сообщением
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

// Фабрика для создания типичных ошибок (упрощает код в сервисах)
export const createError = {
  badRequest: (message = 'Некорректный запрос', code = 'BAD_REQUEST') =>
    new AppError(message, 400, code),

  notFound: (message = 'Ресурс не найден', code = 'NOT_FOUND') =>
    new AppError(message, 404, code),

  conflict: (message = 'Конфликт данных', code = 'CONFLICT') =>
    new AppError(message, 409, code),

  validation: (message = 'Ошибка валидации', code = 'VALIDATION_ERROR') =>
    new AppError(message, 422, code),

  internal: (message = 'Внутренняя ошибка сервера', code = 'INTERNAL_ERROR') =>
    new AppError(message, 500, code),
};

// Сам middleware-обработчик ошибок (должен быть подключён последним в app.js)
export const errorHandler = (err, req, res, next) => {
  // Определяем статус-код
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Внутренняя ошибка сервера';

  // Логируем только серверные ошибки (5xx)
  if (statusCode >= 500) {
    console.error('❌ Ошибка сервера:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  } else {
    // Клиентские ошибки (4xx) логируем кратко
    console.warn(`⚠️ Ошибка ${statusCode}: ${message} [${req.method} ${req.path}]`);
  }

  // Отправляем ответ в едином формате
  res.status(statusCode).json({
    error: {
      code,
      message,
    },
  });
};