module.exports = function(req, res, next) {
    // Проверяем роль пользователя
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Доступ запрещен' });
    }
    next();
  };