const Task = require('../models/Task');
const Status = require('../models/Status');

// Получение всех задач
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('status', 'name color')
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name')
      .populate('attachments')
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Получение задачи по ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('status', 'name color')
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name')
      .populate({
        path: 'notes',
        populate: {
          path: 'createdBy',
          select: 'name'
        }
      })
      .populate('attachments');
    
    if (!task) {
      return res.status(404).json({ msg: 'Задача не найдена' });
    }
    
    res.json(task);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Задача не найдена' });
    }
    res.status(500).send('Ошибка сервера');
  }
};

// Создание новой задачи
exports.createTask = async (req, res) => {
  const { title, description, priority, status, assignedTo, dueDate, customFields } = req.body;

  try {
    // Проверка существования статуса
    const statusExists = await Status.findById(status);
    if (!statusExists) {
      return res.status(404).json({ msg: 'Указанный статус не существует' });
    }

    const newTask = new Task({
      title,
      description,
      priority,
      status,
      assignedTo,
      dueDate,
      customFields,
      createdBy: req.user.id
    });

    const task = await newTask.save();
    
    // Возвращаем задачу с заполненными полями
    const fullTask = await Task.findById(task._id)
      .populate('status', 'name color')
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name');
      
    res.json(fullTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Обновление задачи
exports.updateTask = async (req, res) => {
  const { title, description, priority, status, assignedTo, dueDate, customFields } = req.body;

  // Построение объекта обновления
  const taskFields = {};
  if (title) taskFields.title = title;
  if (description !== undefined) taskFields.description = description;
  if (priority) taskFields.priority = priority;
  if (status) taskFields.status = status;
  if (assignedTo) taskFields.assignedTo = assignedTo;
  if (dueDate !== undefined) taskFields.dueDate = dueDate;
  if (customFields) taskFields.customFields = customFields;
  taskFields.updatedAt = Date.now();

  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Задача не найдена' });
    }

    // Обновление задачи
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true }
    )
      .populate('status', 'name color')
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name')
      .populate({
        path: 'notes',
        populate: {
          path: 'createdBy',
          select: 'name'
        }
      })
      .populate('attachments');

    res.json(task);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Задача не найдена' });
    }
    res.status(500).send('Ошибка сервера');
  }
};

// Добавление заметки к задаче
exports.addNote = async (req, res) => {
  const { text } = req.body;

  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ msg: 'Задача не найдена' });
    }

    // Добавление заметки
    const newNote = {
      text,
      createdBy: req.user.id
    };

    task.notes.unshift(newNote);

    // Обновление времени изменения задачи
    task.updatedAt = Date.now();
    
    await task.save();

    // Возвращаем задачу с заполненными полями
    const updatedTask = await Task.findById(req.params.id)
      .populate('status', 'name color')
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name')
      .populate({
        path: 'notes',
        populate: {
          path: 'createdBy',
          select: 'name'
        }
      })
      .populate('attachments');
      
    res.json(updatedTask);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Задача не найдена' });
    }
    res.status(500).send('Ошибка сервера');
  }
};

// Удаление задачи
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ msg: 'Задача не найдена' });
    }

    // Проверка прав (только создатель или админ может удалить)
    if (task.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Нет прав на удаление' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Задача удалена' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Задача не найдена' });
    }
    res.status(500).send('Ошибка сервера');
  }
};