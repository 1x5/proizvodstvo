const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Регистрация пользователя
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Проверка существования пользователя
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Пользователь уже существует' });
    }

    // Создание нового пользователя
    user = new User({
      name,
      email,
      password,
      role
    });

    // Хеширование пароля
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Сохранение пользователя
    await user.save();

    // Создание токена
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Аутентификация пользователя
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Проверка существования пользователя
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Неверные учетные данные' });
    }

    // Проверка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Неверные учетные данные' });
    }

    // Создание токена
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Получение данных пользователя
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};