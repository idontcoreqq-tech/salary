import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import incomesRouter from './routes/incomes.js';
import expensesRouter from './routes/expenses.js';
import summaryRouter from './routes/summary.js';

const app = express();

// Middleware для CORS (разрешаем запросы с фронтенда)
app.use(cors(config.corsOptions));

// Middleware для парсинга JSON в теле запроса
app.use(express.json());

// Middleware для логирования запросов (в development-режиме)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Роуты API
app.use('/api/v1/incomes', incomesRouter);
app.use('/api/v1/expenses', expensesRouter);
app.use('/api/v1/summary', summaryRouter);

// Корневой эндпоинт для проверки работоспособности сервера
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Salary Tracker API is running',
    version: '1.0.0',
  });
});

// Обработчик для несуществующих маршрутов (404)
app.use((req, res, next) => {
  const error = new Error(`Маршрут не найден: ${req.method} ${req.path}`);
  error.statusCode = 404;
  error.code = 'NOT_FOUND';
  next(error);
});

// Централизованный обработчик ошибок (должен быть последним!)
app.use(errorHandler);

export default app;