// client/src/components/settings/CategoryManager.js
import React, { useState, useContext } from 'react';
import { SettingsContext } from '../../context/SettingsContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const CategoryManager = () => {
  const settingsContext = useContext(SettingsContext);
  const { settings, updateSettings } = settingsContext;

  const [categories, setCategories] = useState(settings?.categories || []);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#4CAF50');
  const [editingCategory, setEditingCategory] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();

    let newCategories = [...categories];
    const categoryData = {
      id: editingCategory ? editingCategory.id : Date.now().toString(),
      name,
      color
    };

    if (editingCategory) {
      // Обновление существующей категории
      newCategories = newCategories.map(cat => 
        cat.id === editingCategory.id ? categoryData : cat
      );
    } else {
      // Добавление новой категории
      newCategories.push(categoryData);
    }

    setCategories(newCategories);
    await updateSettings({ ...settings, categories: newCategories });

    // Сброс формы
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setColor('#4CAF50');
    setEditingCategory(null);
  };

  const handleEdit = category => {
    setEditingCategory(category);
    setName(category.name);
    setColor(category.color);
  };

  const handleDelete = async categoryId => {
    if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      const newCategories = categories.filter(cat => cat.id !== categoryId);
      setCategories(newCategories);
      await updateSettings({ ...settings, categories: newCategories });
    }
  };

  const onDragEnd = async result => {
    if (!result.destination) return;
    
    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setCategories(items);
    await updateSettings({ ...settings, categories: items });
  };

  return (
    <div className="category-manager">
      <h3>Управление категориями задач</h3>
      
      <form onSubmit={handleSubmit} className="category-form">
        <div className="form-group">
          <label htmlFor="categoryName">Название категории</label>
          <input
            type="text"
            id="categoryName"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="categoryColor">Цвет</label>
          <input
            type="color"
            id="categoryColor"
            name="color"
            value={color}
            onChange={e => setColor(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            <i className={editingCategory ? "fas fa-save" : "fas fa-plus"}></i>
            {editingCategory ? ' Обновить' : ' Добавить'}
          </button>
          {editingCategory && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              <i className="fas fa-times"></i> Отмена
            </button>
          )}
        </div>
      </form>

      <h4>Доступные категории</h4>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="categories">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="category-items">
              {categories && categories.length > 0 ? (
                categories.map((category, index) => (
                  <Draggable key={category.id} draggableId={category.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="category-item"
                      >
                        <div className="category-color" style={{ backgroundColor: category.color }}></div>
                        <div className="category-name">{category.name}</div>
                        <div className="category-actions">
                          <button onClick={() => handleEdit(category)} className="btn btn-sm btn-secondary">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button onClick={() => handleDelete(category.id)} className="btn btn-sm btn-danger">
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))
              ) : (
                <li className="empty-item">Нет доступных категорий</li>
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default CategoryManager;