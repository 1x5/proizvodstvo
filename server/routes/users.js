const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Получение всех пользователей (только для администратора)
router.get('/', [auth, adminAuth], async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// Изменение роли пользователя (только для администратора)
router.put('/:id/role', [auth, adminAuth], async (req, res) => {
  const { role } = req.body;

  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { role } },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }
    res.status(500).send('Ошибка сервера');
  }
});

// Изменение пароля пользователя
router.put('/:id/password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Проверяем, что это текущий пользователь или администратор
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Нет прав на изменение пароля' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }

    // Если не администратор, проверяем текущий пароль
    if (req.user.role !== 'admin') {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Неверный текущий пароль' });
      }
    }

    // Хешируем новый пароль
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ msg: 'Пароль успешно изменен' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

// Удаление пользователя (только для администратора)
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }

    // Нельзя удалить самого себя
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ msg: 'Нельзя удалить собственную учетную запись' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Пользователь удален' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router;