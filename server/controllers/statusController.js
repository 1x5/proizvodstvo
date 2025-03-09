const Status = require('../models/Status');
const Task = require('../models/Task');

// Получение всех статусов
exports.getStatuses = async (req, res) => {
  try {
    const statuses = await Status.find().sort({ order: 1 });
    res.json(statuses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Создание нового статуса
exports.createStatus = async (req, res) => {
  const { name, color } = req.body;

  try {
    // Получаем максимальный порядковый номер
    const maxOrderStatus = await Status.findOne().sort('-order');
    const order = maxOrderStatus ? maxOrderStatus.order + 1 : 1;

    const newStatus = new Status({
      name,
      color,
      order,
      createdBy: req.user.id
    });

    const status = await newStatus.save();
    res.json(status);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Обновление статуса
exports.updateStatus = async (req, res) => {
  const { name, color, order } = req.body;

  // Построение объекта обновления
  const statusFields = {};
  if (name) statusFields.name = name;
  if (color) statusFields.color = color;
  if (order) statusFields.order = order;

  try {
    let status = await Status.findById(req.params.id);

    if (!status) {
      return res.status(404).json({ msg: 'Статус не найден' });
    }

    // Обновление статуса
    status = await Status.findByIdAndUpdate(
      req.params.id,
      { $set: statusFields },
      { new: true }
    );

    res.json(status);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Статус не найден' });
    }
    res.status(500).send('Ошибка сервера');
  }
};

// Удаление статуса
exports.deleteStatus = async (req, res) => {
  try {
    const status = await Status.findById(req.params.id);
    
    if (!status) {
      return res.status(404).json({ msg: 'Статус не найден' });
    }

    // Проверка является ли статус стандартным
    if (status.isDefault) {
      return res.status(400).json({ msg: 'Стандартный статус нельзя удалить' });
    }

    // Проверяем, используется ли статус в задачах
    const tasksCount = await Task.countDocuments({ status: req.params.id });
    if (tasksCount > 0) {
      return res.status(400).json({ 
        msg: 'Невозможно удалить статус, который используется в задачах',
        count: tasksCount 
      });
    }

    await Status.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Статус удален' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Статус не найден' });
    }
    res.status(500).send('Ошибка сервера');
  }
};

// Обновление порядка статусов
exports.updateStatusOrder = async (req, res) => {
  const { statusOrder } = req.body;

  try {
    // Обновляем порядок для каждого статуса
    for (const item of statusOrder) {
      await Status.findByIdAndUpdate(item.id, { order: item.order });
    }

    const statuses = await Status.find().sort({ order: 1 });
    res.json(statuses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};