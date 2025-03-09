const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { register, login, getUser } = require('../controllers/authController');

// Регистрация пользователя
router.post('/register', register);

// Вход пользователя
router.post('/login', login);

// Получение данных пользователя
router.get('/me', auth, getUser);

module.exports = router;