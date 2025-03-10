// client/src/components/tasks/TaskList.js
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TaskContext } from '../../context/TaskContext';
import { StatusContext } from '../../context/StatusContext';
import { SettingsContext } from '../../context/SettingsContext';
import Spinner from '../layout/Spinner';
import './TaskItem.css';

const TaskList = ({ searchTerm, filterCategory, onAddTask }) => {
  const taskContext = useContext(TaskContext);
  const statusContext = useContext(StatusContext);
  const settingsContext = useContext(SettingsContext);

  const { tasks, loading, getTasks } = taskContext;
  const { statuses, getStatuses } = statusContext;
  const { settings } = settingsContext;
  
  const [sortBy, setSortBy] = useState('deadline');

  useEffect(() => {
    getTasks();
    getStatuses();
    // eslint-disable-next-line
  }, []);

  // Настройка периодического обновления списка задач каждые 30 секунд
  useEffect(() => {
    const intervalId = setInterval(() => {
      getTasks();
    }, 30000); // 30 секунд

    return () => clearInterval(intervalId); // Очистка интервала при размонтировании
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <Spinner />;
  }

  const groupTasksByStatus = () => {
    const groupedTasks = {};
    
    // Инициализация групп для всех статусов
    if (statuses && statuses.length > 0) {
      statuses.forEach(status => {
        groupedTasks[status._id] = {
          status,
          tasks: []
        };
      });

      // Фильтрация и сортировка задач
      let filteredTasks = tasks || [];
      
      // Применение поиска
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredTasks = filteredTasks.filter(task => 
          (task.title && task.title.toLowerCase().includes(term)) || 
          (task.description && task.description.toLowerCase().includes(term))
        );
      }
      
      // Применение фильтра по категории
      if (filterCategory !== 'all') {
        filteredTasks = filteredTasks.filter(task => 
          task.category === filterCategory
        );
      }
      
      // Применение сортировки
      switch (sortBy) {
        case 'deadline':
          filteredTasks.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
          });
          break;
        case 'priority':
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          filteredTasks.sort((a, b) => 
            priorityOrder[a.priority || 'medium'] - priorityOrder[b.priority || 'medium']
          );
          break;
        case 'created':
          filteredTasks.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;
        default:
          break;
      }

      // Распределение задач по группам
      filteredTasks.forEach(task => {
        const statusId = typeof task.status === 'object' ? task.status._id : task.status;
        
        if (statusId && groupedTasks[statusId]) {
          groupedTasks[statusId].tasks.push(task);
        } else {
          // Если статус не найден в списке или его нет, добавляем в "Неизвестный статус"
          const unknownId = "unknown";
          if (!groupedTasks[unknownId]) {
            groupedTasks[unknownId] = {
              status: { 
                _id: unknownId, 
                name: "Неизвестный статус", 
                color: "#CCCCCC" 
              },
              tasks: []
            };
          }
          groupedTasks[unknownId].tasks.push(task);
        }
      });
    } else {
      // Если статусы не загружены, создаем временную группу "Неизвестный статус"
      const unknownId = "unknown";
      groupedTasks[unknownId] = {
        status: { 
          _id: unknownId, 
          name: "Неизвестный статус", 
          color: "#CCCCCC" 
        },
        tasks: tasks || []
      };
    }

    return Object.values(groupedTasks);
  };

  // Получаем иконку в зависимости от статуса
  const getStatusIcon = (statusName) => {
    if (!statusName) return "fas fa-question";
    
    const name = statusName.toLowerCase();
    if (name.includes("новый") || name.includes("заказ")) {
      return "fas fa-file";
    } else if (name.includes("работе") || name.includes("процессе")) {
      return "fas fa-spinner";
    } else if (name.includes("сварен")) {
      return "fas fa-tools";
    } else if (name.includes("покрашен")) {
      return "fas fa-paint-brush";
    } else if (name.includes("разработка")) {
      return "fas fa-code";
    } else {
      return "fas fa-tasks";
    }
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  // Определение класса приоритета
  const getPriorityClass = (priority) => {
    if (!priority) return '';
    switch (priority.toLowerCase()) {
      case 'high':
      case 'высокий':
        return 'priority-high';
      case 'medium':
      case 'средний':
        return 'priority-medium';
      case 'low':
      case 'низкий':
        return 'priority-low';
      default:
        return '';
    }
  };

  // Получение названия категории по ID
  const getCategoryName = (categoryId) => {
    if (!categoryId || !settings || !settings.categories) return '';
    const category = settings.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  };

  // Получение цвета категории по ID
  const getCategoryColor = (categoryId) => {
    if (!categoryId || !settings || !settings.categories) return '';
    const category = settings.categories.find(c => c.id === categoryId);
    return category ? category.color : '';
  };

  // Главная часть компонента
  return (
    <div>
      <div className="filter-controls">
        <select 
          className="form-control"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="deadline">По сроку</option>
          <option value="priority">По приоритету</option>
          <option value="created">По дате создания</option>
        </select>
      </div>

      {!tasks || tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="fas fa-tasks"></i>
          </div>
          <h3 className="empty-state-title">Нет задач</h3>
          <p className="empty-state-description">Нажмите "Добавить задачу", чтобы создать новую задачу</p>
          <button onClick={onAddTask} className="btn btn-primary">
            <i className="fas fa-plus"></i> Добавить задачу
          </button>
        </div>
      ) : (
        <div className="task-columns">
          {groupTasksByStatus().map(group => (
            <div 
              key={group.status._id} 
              className="task-column"
            >
              <div className="column-header" style={{ borderBottomColor: group.status.color || 'var(--primary-color)' }}>
                <div className="column-title">
                  <i className={getStatusIcon(group.status.name)} style={{ color: group.status.color || 'var(--primary-color)' }}></i>
                  {group.status.name}
                </div>
                <span 
                  className="task-count"
                  style={{ backgroundColor: group.status.color || 'var(--primary-color)' }}
                >
                  {group.tasks.length}
                </span>
              </div>
              
              {group.tasks.length === 0 ? (
                <div className="empty-column">
                  Нет задач в этом статусе
                </div>
              ) : (
                <div className="tasks-grid">
                  {group.tasks.map(task => (
                    <Link key={task._id} to={`/tasks/${task._id}`} className="task-link">
                      <div className={`task-card ${getPriorityClass(task.priority)}`}>
                        <h3 className="task-title">{task.title || "Без названия"}</h3>
                        {task.description && (
                          <p className="task-description">
                            {task.description.length > 100
                              ? `${task.description.substring(0, 100)}...`
                              : task.description}
                          </p>
                        )}
                        <div className="task-meta">
                          <div className="task-info">
                            {task.category && (
                              <span className="task-category" style={{ 
                                backgroundColor: `${getCategoryColor(task.category)}20`, 
                                color: getCategoryColor(task.category) 
                              }}>
                                {getCategoryName(task.category)}
                              </span>
                            )}
                            {task.dueDate && (
                              <div className="task-due-date">
                                <i className="far fa-calendar-alt"></i>
                                {formatDate(task.dueDate)}
                              </div>
                            )}
                          </div>
                          <div className="task-assignee">
                            {task.assignedTo && (
                              <>
                                <i className="far fa-user"></i>
                                {typeof task.assignedTo === 'object' 
                                  ? task.assignedTo.name 
                                  : 'Назначено'}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;