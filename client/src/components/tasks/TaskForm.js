// client/src/components/tasks/TaskForm.js
import React, { useState, useContext, useEffect } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { StatusContext } from '../../context/StatusContext';
import { AuthContext } from '../../context/AuthContext';
import { SettingsContext } from '../../context/SettingsContext';
import './TaskForm.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TaskForm = ({ onTaskAdded }) => {
  const taskContext = useContext(TaskContext);
  const statusContext = useContext(StatusContext);
  const authContext = useContext(AuthContext);
  const settingsContext = useContext(SettingsContext);

  const { createTask } = taskContext;
  const { statuses } = statusContext;
  const { user } = authContext;
  const { settings } = settingsContext;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [category, setCategory] = useState('');
  const [assignedTo, setAssignedTo] = useState([]);
  const [dueDate, setDueDate] = useState(null);
  const [customFields, setCustomFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Установка первого статуса по умолчанию
    if (statuses && statuses.length > 0 && !selectedStatus) {
      setSelectedStatus(statuses[0]._id);
    }

    // Установка первой категории по умолчанию
    if (settings && settings.categories && settings.categories.length > 0 && !category) {
      setCategory(settings.categories[0].id);
    }

    // Инициализация пользовательских полей
    if (settings && settings.taskFields) {
      const initialCustomFields = {};
      settings.taskFields.forEach(field => {
        initialCustomFields[field.name] = '';
      });
      setCustomFields(initialCustomFields);
    }
  }, [statuses, settings, selectedStatus, category]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Название задачи обязательно';
    }
    
    if (!selectedStatus) {
      newErrors.status = 'Статус обязателен';
    }

    if (!category) {
      newErrors.category = 'Категория обязательна';
    }
    
    // Проверка обязательных пользовательских полей
    if (settings && settings.taskFields) {
      settings.taskFields.forEach(field => {
        if (field.required && !customFields[field.name]) {
          newErrors[field.name] = `Поле "${field.name}" обязательно`;
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    const newTask = {
      title,
      description,
      priority,
      status: selectedStatus,
      category,
      assignedTo: user ? [user._id] : [], // По умолчанию задача назначается создателю
      dueDate,
      customFields
    };

    try {
      const result = await createTask(newTask);
      
      if (result) {
        // Сброс формы
        setTitle('');
        setDescription('');
        setPriority('medium');
        setCategory('');
        setDueDate(null);
        
        // Сброс пользовательских полей
        if (settings && settings.taskFields) {
          const initialCustomFields = {};
          settings.taskFields.forEach(field => {
            initialCustomFields[field.name] = '';
          });
          setCustomFields(initialCustomFields);
        }

        // Очистка ошибок
        setErrors({});

        // Уведомление родительского компонента
        if (onTaskAdded) {
          onTaskAdded(result);
        }
      }
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
      setErrors({ submit: 'Ошибка при создании задачи. Пожалуйста, попробуйте снова.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomFieldChange = (fieldName, value) => {
    setCustomFields({
      ...customFields,
      [fieldName]: value
    });
    
    // Очистка ошибки поля при изменении
    if (errors[fieldName]) {
      setErrors({
        ...errors,
        [fieldName]: undefined
      });
    }
  };

  const renderCustomFields = () => {
    if (!settings || !settings.taskFields) return null;

    return settings.taskFields.map(field => {
      // Рендеринг в зависимости от типа поля
      switch (field.type) {
        case 'text':
          return (
            <div className="form-group" key={field.name}>
              <label className="form-label" htmlFor={field.name}>
                {field.name} {field.required && <span className="required">*</span>}
              </label>
              <input
                type="text"
                name={field.name}
                id={field.name}
                value={customFields[field.name] || ''}
                onChange={e => handleCustomFieldChange(field.name, e.target.value)}
                required={field.required}
                className={`form-control ${errors[field.name] ? 'error-border' : ''}`}
              />
              {errors[field.name] && <div className="error-message">{errors[field.name]}</div>}
            </div>
          );
        case 'number':
          return (
            <div className="form-group" key={field.name}>
              <label className="form-label" htmlFor={field.name}>
                {field.name} {field.required && <span className="required">*</span>}
              </label>
              <input
                type="number"
                name={field.name}
                id={field.name}
                value={customFields[field.name] || ''}
                onChange={e => handleCustomFieldChange(field.name, e.target.value)}
                required={field.required}
                className={`form-control ${errors[field.name] ? 'error-border' : ''}`}
              />
              {errors[field.name] && <div className="error-message">{errors[field.name]}</div>}
            </div>
          );
        case 'date':
          return (
            <div className="form-group" key={field.name}>
              <label className="form-label" htmlFor={field.name}>
                {field.name} {field.required && <span className="required">*</span>}
              </label>
              <DatePicker
                selected={customFields[field.name] ? new Date(customFields[field.name]) : null}
                onChange={date => handleCustomFieldChange(field.name, date)}
                className={`form-control ${errors[field.name] ? 'error-border' : ''}`}
                required={field.required}
                dateFormat="dd.MM.yyyy"
                placeholderText="Выберите дату"
                id={field.name}
              />
              {errors[field.name] && <div className="error-message">{errors[field.name]}</div>}
            </div>
          );
        case 'dropdown':
          return (
            <div className="form-group" key={field.name}>
              <label className="form-label" htmlFor={field.name}>
                {field.name} {field.required && <span className="required">*</span>}
              </label>
              <select
                name={field.name}
                id={field.name}
                value={customFields[field.name] || ''}
                onChange={e => handleCustomFieldChange(field.name, e.target.value)}
                required={field.required}
                className={`form-select ${errors[field.name] ? 'error-border' : ''}`}
              >
                <option value="">Выберите...</option>
                {field.options && field.options.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors[field.name] && <div className="error-message">{errors[field.name]}</div>}
            </div>
          );
        case 'checkbox':
          return (
            <div className="form-check" key={field.name}>
              <input
                type="checkbox"
                id={field.name}
                name={field.name}
                checked={customFields[field.name] || false}
                onChange={e => handleCustomFieldChange(field.name, e.target.checked)}
                required={field.required}
                className={`form-check-input ${errors[field.name] ? 'error-border' : ''}`}
              />
              <label className="form-check-label" htmlFor={field.name}>
                {field.name} {field.required && <span className="required">*</span>}
              </label>
              {errors[field.name] && <div className="error-message">{errors[field.name]}</div>}
            </div>
          );
        default:
          return null;
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="task-form">
      <h2 className="card-title mb-4">Создать новую задачу</h2>
      
      {errors.submit && (
        <div className="alert alert-danger">{errors.submit}</div>
      )}
      
      <div className="form-group">
        <label className="form-label" htmlFor="title">
          Название <span className="required">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={e => {
            setTitle(e.target.value);
            if (errors.title) setErrors({...errors, title: undefined});
          }}
          className={`form-control ${errors.title ? 'error-border' : ''}`}
          placeholder="Введите название задачи"
          required
        />
        {errors.title && <div className="error-message">{errors.title}</div>}
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="description">Описание</label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="form-control"
          rows="4"
          placeholder="Введите подробное описание задачи"
        ></textarea>
      </div>
      
      <div className="form-row">
        <div className="form-col">
          <label className="form-label" htmlFor="priority">Приоритет</label>
          <select
            id="priority"
            name="priority"
            value={priority}
            onChange={e => setPriority(e.target.value)}
            className="form-select"
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </div>
        
        <div className="form-col">
          <label className="form-label" htmlFor="status">
            Статус <span className="required">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={selectedStatus}
            onChange={e => {
              setSelectedStatus(e.target.value);
              if (errors.status) setErrors({...errors, status: undefined});
            }}
            className={`form-select ${errors.status ? 'error-border' : ''}`}
            required
          >
            <option value="">Выберите статус</option>
            {statuses && statuses.map(status => (
              <option key={status._id} value={status._id}>
                {status.name}
              </option>
            ))}
          </select>
          {errors.status && <div className="error-message">{errors.status}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <label className="form-label" htmlFor="category">
            Категория <span className="required">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={e => {
              setCategory(e.target.value);
              if (errors.category) setErrors({...errors, category: undefined});
            }}
            className={`form-select ${errors.category ? 'error-border' : ''}`}
            required
          >
            <option value="">Выберите категорию</option>
            {settings && settings.categories && settings.categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <div className="error-message">{errors.category}</div>}
        </div>
        
        <div className="form-col">
          <label className="form-label" htmlFor="dueDate">Срок выполнения</label>
          <DatePicker
            id="dueDate"
            selected={dueDate}
            onChange={date => setDueDate(date)}
            className="form-control"
            placeholderText="Выберите дату"
            dateFormat="dd.MM.yyyy"
          />
        </div>
      </div>

      {/* Пользовательские поля */}
      {settings && settings.taskFields && settings.taskFields.length > 0 && (
        <div className="custom-fields-section mt-4">
          <h3 className="card-subtitle mb-3">Дополнительные поля</h3>
          {renderCustomFields()}
        </div>
      )}

      <div className="form-actions">
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={() => {
            setTitle('');
            setDescription('');
            setPriority('medium');
            setCategory('');
            setDueDate(null);
            // Сброс пользовательских полей
            if (settings && settings.taskFields) {
              const initialCustomFields = {};
              settings.taskFields.forEach(field => {
                initialCustomFields[field.name] = '';
              });
              setCustomFields(initialCustomFields);
            }
            setErrors({});
          }}
        >
          Отмена
        </button>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Создание...' : 'Создать задачу'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;