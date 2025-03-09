const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Загрузка переменных окружения
dotenv.config();

// Инициализация приложения Express
const app = express();

// Подключение к базе данных
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Определение маршрутов API
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/statuses', require('./routes/statuses'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/files', require('./routes/files'));

// Обслуживание статических файлов в production режиме
if (process.env.NODE_ENV === 'production') {
  // Установка статической папки
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// Определение порта и запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));