import path from 'path';
import { fileURLToPath } from 'url';

// Получаем текущую директорию для ES-модулей (аналог __dirname в CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Корневая директория сервера (папка server/)
const serverDir = path.resolve(__dirname, '../../');

export const config = {
  // Порт, на котором будет работать сервер
  port: process.env.PORT || 3001,

  // Настройки CORS для разрешения запросов с фронтенда (Vite по умолчанию на 5173)
  corsOptions: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },

  // Путь к файлу базы данных SQLite (будет создан автоматически)
  dbPath: path.join(serverDir, 'data', 'salary_tracker.db'),
};