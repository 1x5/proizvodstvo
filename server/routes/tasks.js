const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  getTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask,
  addNote 
} = require('../controllers/taskController');

// Получение всех задач
router.get('/', auth, getTasks);

// Получение задачи по ID
router.get('/:id', auth, getTaskById);

// Создание новой задачи
router.post('/', auth, createTask);

// Обновление задачи
router.put('/:id', auth, updateTask);

// Добавление заметки к задаче
router.post('/:id/notes', auth, addNote);

// Удаление задачи
router.delete('/:id', auth, deleteTask);

module.exports = router;