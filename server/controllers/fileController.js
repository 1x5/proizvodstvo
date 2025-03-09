const File = require('../models/File');
const Task = require('../models/Task');
const fs = require('fs');
const path = require('path');

// Загрузка файла
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Файл не загружен' });
    }

    const { taskId } = req.body;

    // Проверка существования задачи
    if (taskId) {
      const task = await Task.findById(taskId);
      if (!task) {
        // Удаляем загруженный файл, если задача не существует
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ msg: 'Задача не найдена' });
      }
    }

    // Создание записи о файле
    const newFile = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      path: req.file.path,
      size: req.file.size,
      uploadedBy: req.user.id,
      task: taskId || null
    });

    const file = await newFile.save();

    // Если файл привязан к задаче, добавляем его в массив вложений
    if (taskId) {
      await Task.findByIdAndUpdate(taskId, {
        $push: { attachments: file._id },
        updatedAt: Date.now()
      });
    }

    res.json(file);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Получение файла
exports.getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ msg: 'Файл не найден' });
    }

    res.sendFile(path.resolve(file.path));
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Файл не найден' });
    }
    res.status(500).send('Ошибка сервера');
  }
};

// Удаление файла
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ msg: 'Файл не найден' });
    }

    // Проверка прав (только загрузивший или админ может удалить)
    if (file.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Нет прав на удаление' });
    }

    // Удаляем файл с диска
    try {
      fs.unlinkSync(file.path);
    } catch (error) {
      console.error('Ошибка при удалении файла с диска:', error.message);
      // Продолжаем выполнение даже если файл не найден на диске
    }

    // Если файл привязан к задаче, удаляем его из массива вложений
    if (file.task) {
      await Task.findByIdAndUpdate(file.task, {
        $pull: { attachments: file._id },
        updatedAt: Date.now()
      });
    }

    await File.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Файл удален' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Файл не найден' });
    }
    res.status(500).send('Ошибка сервера');
  }
};