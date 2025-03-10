// client/src/components/settings/CustomFieldsManager.js
import React, { useState, useContext } from 'react';
import { SettingsContext } from '../../context/SettingsContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const CustomFieldsManager = () => {
  const settingsContext = useContext(SettingsContext);
  const { settings, updateSettings } = settingsContext;

  const [fields, setFields] = useState(settings?.taskFields || []);
  const [name, setName] = useState('');
  const [type, setType] = useState('text');
  const [required, setRequired] = useState(false);
  const [options, setOptions] = useState('');
  const [editingField, setEditingField] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();

    let newFields = [...fields];
    const fieldData = {
      name,
      type,
      required,
      options: type === 'dropdown' ? options.split(',').map(opt => opt.trim()) : []
    };

    if (editingField !== null) {
      // Обновление существующего поля
      newFields[editingField] = {
        ...newFields[editingField],
        ...fieldData
      };
    } else {
      // Добавление нового поля
      fieldData.order = fields.length + 1;
      newFields.push(fieldData);
    }

    setFields(newFields);
    await updateSettings({ ...settings, taskFields: newFields });

    // Сброс формы
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setType('text');
    setRequired(false);
    setOptions('');
    setEditingField(null);
  };

  const handleEdit = index => {
    const field = fields[index];
    setName(field.name);
    setType(field.type);
    setRequired(field.required);
    setOptions(field.options?.join(', ') || '');
    setEditingField(index);
  };

  const handleDelete = async index => {
    if (window.confirm('Вы уверены, что хотите удалить это поле?')) {
      const newFields = fields.filter((_, i) => i !== index);
      // Обновление порядка
      newFields.forEach((field, i) => {
        field.order = i + 1;
      });
      
      setFields(newFields);
      await updateSettings({ ...settings, taskFields: newFields });
    }
  };

  const onDragEnd = async result => {
    if (!result.destination) return;
    
    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Обновление порядка
    items.forEach((field, i) => {
      field.order = i + 1;
    });
    
    setFields(items);
    await updateSettings({ ...settings, taskFields: items });
  };

  // Функция для получения человекочитаемого названия типа поля
  const getFieldTypeName = (type) => {
    switch(type) {
      case 'text': return 'Текст';
      case 'number': return 'Число';
      case 'date': return 'Дата';
      case 'dropdown': return 'Список';
      case 'checkbox': return 'Чекбокс';
      default: return type;
    }
  };

  return (
    <div className="custom-fields-manager">
      <h3>Пользовательские поля для задач</h3>
      
      <form onSubmit={handleSubmit} className="field-form">
        <div className="form-group">
          <label htmlFor="fieldName">Название поля</label>
          <input
            type="text"
            id="fieldName"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="fieldType">Тип поля</label>
          <select
            id="fieldType"
            name="type"
            value={type}
            onChange={e => setType(e.target.value)}
            className="form-control"
          >
            <option value="text">Текст</option>
            <option value="number">Число</option>
            <option value="date">Дата</option>
            <option value="dropdown">Выпадающий список</option>
            <option value="checkbox">Чекбокс</option>
          </select>
        </div>
        {type === 'dropdown' && (
          <div className="form-group">
            <label htmlFor="fieldOptions">Варианты (через запятую)</label>
            <input
              type="text"
              id="fieldOptions"
              name="options"
              value={options}
              onChange={e => setOptions(e.target.value)}
              placeholder="Вариант 1, Вариант 2, Вариант 3"
              required
              className="form-control"
            />
          </div>
        )}
        <div className="form-group checkbox">
          <input
            type="checkbox"
            id="fieldRequired"
            name="required"
            checked={required}
            onChange={e => setRequired(e.target.checked)}
          />
          <label htmlFor="fieldRequired">Обязательное поле</label>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            <i className={editingField !== null ? "fas fa-save" : "fas fa-plus"}></i>
            {editingField !== null ? ' Обновить' : ' Добавить'}
          </button>
          {editingField !== null && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              <i className="fas fa-times"></i> Отмена
            </button>
          )}
        </div>
      </form>

      <h4>Доступные поля</h4>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="fields">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="field-items">
              {fields && fields.length > 0 ? (
                fields.map((field, index) => (
                  <Draggable key={index} draggableId={`field-${index}`} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="field-item"
                      >
                        <div className="field-info">
                          <div className="field-name">{field.name}</div>
                          <div className="field-type">{getFieldTypeName(field.type)}</div>
                          {field.required && <div className="field-required">Обязательное</div>}
                        </div>
                        <div className="field-actions">
                          <button onClick={() => handleEdit(index)} className="btn btn-sm btn-secondary">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button onClick={() => handleDelete(index)} className="btn btn-sm btn-danger">
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))
              ) : (
                <li className="status-item">Нет доступных полей</li>
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default CustomFieldsManager;