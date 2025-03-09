const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  getStatuses, 
  createStatus, 
  updateStatus, 
  deleteStatus,
  updateStatusOrder 
} = require('../controllers/statusController');

// Получение всех статусов
router.get('/', auth, getStatuses);

// Создание нового статуса
router.post('/', auth, createStatus);

// Обновление статуса
router.put('/:id', auth, updateStatus);

// Удаление статуса
router.delete('/:id', auth, deleteStatus);

// Обновление порядка статусов
router.put('/', auth, updateStatusOrder);

module.exports = router;