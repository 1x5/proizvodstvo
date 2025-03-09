const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadFile, getFile, deleteFile } = require('../controllers/fileController');

// Настройка хранилища для multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = './server/uploads';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Фильтр файлов
const fileFilter = (req, file, cb) => {
  // Разрешенные типы файлов
  const allowedFileTypes = [
    'image/jpeg', 
    'image/png', 
    'image/gif', 
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ];
  
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Неподдерживаемый тип файла'), false);
  }
};

// Настройка загрузки
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Загрузка файла
router.post('/', auth, upload.single('file'), uploadFile);

// Получение файла
router.get('/:id', auth, getFile);

// Удаление файла
router.delete('/:id', auth, deleteFile);

module.exports = router;