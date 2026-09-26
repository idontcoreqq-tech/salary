import app from './src/app.js';
import { config } from './src/config/index.js';
import db from './src/db/connection.js'; // Импортируем для инициализации БД при старте

// Запускаем сервер
const startServer = () => {
  try {
    app.listen(config.port, () => {
      console.log(`\n🚀 Сервер запущен на порту ${config.port}`);
      console.log(`📡 API доступен по адресу: http://localhost:${config.port}/api/v1`);
      console.log(`🔗 CORS разрешён для: ${config.corsOptions.origin}\n`);
    });
  } catch (error) {
    console.error('❌ Ошибка запуска сервера:', error);
    process.exit(1);
  }
};

// Обработка необработанных исключений
process.on('uncaughtException', (error) => {
  console.error('❌ Необработанное исключение:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Необработанный отказ промиса:', reason);
  process.exit(1);
});

// Запуск
startServer();