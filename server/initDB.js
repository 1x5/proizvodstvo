const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Status = require('./models/Status');
const Settings = require('./models/Settings');
const dotenv = require('dotenv');

// Загрузка переменных окружения
dotenv.config();

const initDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Проверяем существование администратора
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      console.log('Creating admin user...');
      // Создаем администратора
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const admin = new User({
        name: 'Администратор',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      await admin.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }

    // Проверяем статусы
    const statusCount = await Status.countDocuments();
    
    if (statusCount === 0) {
      console.log('Creating initial statuses...');
      // Создаем начальные статусы
      const admin = await User.findOne({ role: 'admin' });
      
      const statuses = [
        {
          name: 'Новая',
          color: '#3498db',
          order: 1,
          createdBy: admin._id,
          isDefault: true
        },
        {
          name: 'В работе',
          color: '#f39c12',
          order: 2,
          createdBy: admin._id,
          isDefault: false
        },
        {
          name: 'На проверке',
          color: '#9b59b6',
          order: 3,
          createdBy: admin._id,
          isDefault: false
        },
        {
          name: 'Завершена',
          color: '#2ecc71',
          order: 4,
          createdBy: admin._id,
          isDefault: false
        }
      ];
      
      await Status.insertMany(statuses);
      console.log('Initial statuses created successfully');
    } else {
      console.log('Statuses already exist');
    }

    // Проверяем настройки
    const settingsExist = await Settings.findOne();
    
    if (!settingsExist) {
      console.log('Creating initial settings...');
      const admin = await User.findOne({ role: 'admin' });
      
      const settings = new Settings({
        companyName: 'Производственная компания',
        updatedBy: admin._id,
        taskFields: [
          {
            name: 'Номер задачи',
            type: 'text',
            required: true,
            order: 1
          },
          {
            name: 'Оборудование',
            type: 'dropdown',
            required: false,
            options: ['Станок 1', 'Станок 2', 'Станок 3'],
            order: 2
          },
          {
            name: 'Срочный заказ',
            type: 'checkbox',
            required: false,
            order: 3
          }
        ]
      });
      
      await settings.save();
      console.log('Initial settings created successfully');
    } else {
      console.log('Settings already exist');
    }
    
    console.log('Database initialization completed');
    
    // Закрываем соединение с базой данных после успешной инициализации
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (err) {
    console.error('Database initialization failed:', err.message);
    process.exit(1);
  }
};

initDB();