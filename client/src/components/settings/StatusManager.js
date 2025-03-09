import React, { useState, useContext, useEffect } from 'react';
import { StatusContext } from '../../context/StatusContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const StatusManager = () => {
  const statusContext = useContext(StatusContext);
  const { statuses, createStatus, updateStatus, deleteStatus, updateStatusOrder } = statusContext;

  const [name, setName] = useState('');
  const [color, setColor] = useState('#3498db');
  const [editingStatus, setEditingStatus] = useState(null);
  const [statusList, setStatusList] = useState([]);

  useEffect(() => {
    setStatusList(statuses);
  }, [statuses]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (editingStatus) {
      await updateStatus(editingStatus._id, { name, color });
      setEditingStatus(null);
    } else {
      await createStatus({ name, color });
    }

    // Сброс формы
    setName('');
    setColor('#3498db');
  };

  const handleEdit = status => {
    setEditingStatus(status);
    setName(status.name);
    setColor(status.color);
  };

  const handleDelete = async statusId => {
    if (window.confirm('Вы уверены, что хотите удалить этот статус?')) {
      await deleteStatus(statusId);
    }
  };

  const handleCancel = () => {
    setEditingStatus(null);
    setName('');
    setColor('#3498db');
  };

  const onDragEnd = async result => {
    if (!result.destination) return;
    
    const items = Array.from(statusList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setStatusList(items);
    
    // Обновление порядка в базе данных
    const statusOrder = items.map((item, index) => ({
      id: item._id,
      order: index + 1
    }));
    
    await updateStatusOrder(statusOrder);
  };

  return (
    <div className="status-manager">
      <h3>Управление статусами</h3>
      
      <form onSubmit={handleSubmit} className="status-form">
        <div className="form-group">
          <label htmlFor="name">Название статуса</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="color">Цвет</label>
          <input
            type="color"
            name="color"
            value={color}
            onChange={e => setColor(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingStatus ? 'Обновить' : 'Добавить'}
          </button>
          {editingStatus && (
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Отмена
            </button>
          )}
        </div>
      </form>

      <div className="status-list">
        <h4>Доступные статусы</h4>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="statuses">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef} className="status-items">
                {statusList.map((status, index) => (
                  <Draggable key={status._id} draggableId={status._id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="status-item"
                      >
                        <div className="status-color" style={{ backgroundColor: status.color }}></div>
                        <div className="status-name">{status.name}</div>
                        <div className="status-actions">
                          <button onClick={() => handleEdit(status)} className="btn btn-sm btn-secondary">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button onClick={() => handleDelete(status._id)} className="btn btn-sm btn-danger">
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default StatusManager;