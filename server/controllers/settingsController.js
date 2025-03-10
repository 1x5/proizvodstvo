const Settings = require('../models/Settings');

// Получение настроек
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // Если настройки не существуют, создаем по умолчанию
    if (!settings) {
      settings = new Settings({
        updatedBy: req.user.id
      });
      await settings.save();
    }
    
    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Обновление настроек
exports.updateSettings = async (req, res) => {
  const { companyName, logo, taskFields, categories } = req.body;

  // Построение объекта обновления
  const settingsFields = {};
  if (companyName !== undefined) settingsFields.companyName = companyName;
  if (logo !== undefined) settingsFields.logo = logo;
  if (taskFields) settingsFields.taskFields = taskFields;
  if (categories) settingsFields.categories = categories;
  settingsFields.updatedBy = req.user.id;
  settingsFields.updatedAt = Date.now();

  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Если настройки не существуют, создаем новые
      settings = new Settings(settingsFields);
      await settings.save();
    } else {
      // Обновляем существующие настройки
      settings = await Settings.findOneAndUpdate(
        {},
        { $set: settingsFields },
        { new: true }
      );
    }
    
    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};