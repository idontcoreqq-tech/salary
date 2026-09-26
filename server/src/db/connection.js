import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/index.js';

// Получаем текущую директорию для ES-модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Создаём папку для базы данных, если её нет
const dbDir = path.dirname(config.dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Инициализируем соединение с SQLite
const db = new Database(config.dbPath);

// Включаем WAL режим для лучшей производительности при параллельных запросах
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Читаем и выполняем SQL-схему для создания таблиц
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schema);

console.log('✅ База данных инициализирована:', config.dbPath);

export default db;