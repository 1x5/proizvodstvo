const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Получаем токен из заголовка
  const token = req.header('x-auth-token');

  // Проверяем наличие токена
  if (!token) {
    return res.status(401).json({ msg: 'Нет токена, авторизация отклонена' });
  }

  try {
    // Верификация токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Токен недействителен' });
  }
};