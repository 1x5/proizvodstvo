const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { getSettings, updateSettings } = require('../controllers/settingsController');

// Получение настроек
router.get('/', auth, getSettings);

// Обновление настроек (только для администратора)
router.put('/', [auth, adminAuth], updateSettings);

module.exports = router;