// client/src/components/tasks/TaskItem.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { TaskContext } from '../../context/TaskContext';
import { StatusContext } from '../../context/StatusContext';
import 'moment/locale/ru';

moment.locale('ru');

const TaskItem = ({ task }) => {
  const taskContext = useContext(TaskContext);
  const statusContext = useContext(StatusContext);
  const { updateTask } = taskContext;
  const { statuses } = statusContext;

  // Функция для изменения статуса задачи
  const handleStatusChange = async (statusId) => {
    try {
      await updateTask(task._id, { status: statusId });
    } catch (err) {
      console.error('Ошибка при изменении статуса:', err);
    }
  };

  // Получение класса для приоритета
  const getPriorityClass = () => {
    switch (task.priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  // Получение метки приоритета
  const getPriorityLabel = () => {
    switch (task.priority) {
      case 'high':
        return 'Высокий';
      case 'medium':
        return 'Средний';
      case 'low':
        return 'Низкий';
      default:
        return 'Средний';
    }
  };

  // Получение инициалов пользователя
  const getUserInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Форматирование времени выполнения
  const formatTimeLeft = (dueDate) => {
    if (!dueDate) return null;
    
    const now = moment();
    const due = moment(dueDate);
    const diff = due.diff(now, 'days');
    
    if (diff < 0) {
      return 'Просрочено';
    } else if (diff === 0) {
      return 'Сегодня';
    } else if (diff === 1) {
      return '1 день';
    } else {
      return `${diff} дней`;
    }
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <Link to={`/tasks/${task._id}`} className="task-title">
          {task.title || 'Без названия'}
        </Link>
        <div className="status-dropdown">
          <div 
            className="status-badge" 
            style={{ backgroundColor: task.status?.color || '#4364f7' }}
          >
            {task.status?.name || 'Статус'}
          </div>
          <div className="status-dropdown-content">
            {statuses && statuses.map(status => (
              <div
                key={status._id}
                onClick={() => handleStatusChange(status._id)}
                className="status-option"
                style={{ color: status.color || '#4364f7' }}
              >
                {status.name}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {task.description && (
        <div className="task-description">
          {task.description.length > 100 
            ? `${task.description.substring(0, 100)}...` 
            : task.description}
        </div>
      )}
      
      <div className="progress-container">
        <div 
          className="progress-bar" 
          style={{ width: `${task.progress || 0}%` }}
        ></div>
      </div>
      
      <div className="task-meta">
        <div className="task-info-row">
          <div className={`task-priority ${getPriorityClass()}`}>
            {getPriorityLabel()}
          </div>
          
          {task.dueDate && (
            <div className="task-time">
              <i className="far fa-clock"></i>
              <span>{formatTimeLeft(task.dueDate)}</span>
            </div>
          )}
        </div>
        
        <div className="task-info-row">
          {task.createdBy && (
            <div className="task-created-by">
              <div className="task-avatar">
                {getUserInitials(task.createdBy.name)}
              </div>
              <span className="user-name">{task.createdBy.name}</span>
            </div>
          )}
          
          {task.createdAt && (
            <div className="task-date">
              <i className="far fa-calendar-alt"></i>
              <span>{moment(task.createdAt).format('DD.MM.YYYY')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;