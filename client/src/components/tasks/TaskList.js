// client/src/components/tasks/TaskList.js
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TaskContext } from '../../context/TaskContext';
import { StatusContext } from '../../context/StatusContext';
import TaskItem from './TaskItem';
import Spinner from '../layout/Spinner';

const TaskList = () => {
  const taskContext = useContext(TaskContext);
  const statusContext = useContext(StatusContext);

  const { tasks, loading, getTasks } = taskContext;
  const { statuses, getStatuses } = statusContext;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
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
    if (statuses) {
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
        if (task.status && groupedTasks[task.status._id]) {
          groupedTasks[task.status._id].tasks.push(task);
        } else if (task.status) {
          // Если статус не найден в списке, но есть в задаче
          // создаем новую группу для этого статуса
          groupedTasks[task.status._id] = {
            status: task.status,
            tasks: [task]
          };
        }
      });
    }

    return Object.values(groupedTasks);
  };

  return (
    <div className="task-board-container">
      <div className="page-header">
        <h2 className="page-title">Задачи</h2>
        <div className="page-actions">
          <Link to="/tasks/new" className="btn btn-primary">
            <i className="fas fa-plus"></i> Добавить задачу
          </Link>
        </div>
      </div>
      
      <div className="filters-container mb-4">
        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Поиск задач..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters">
          <div className="filter-group">
            <label className="filter-label">Категория:</label>
            <select 
              className="form-select"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
            >
              <option value="all">Все категории</option>
              <option value="development">Разработка</option>
              <option value="design">Дизайн</option>
              <option value="marketing">Маркетинг</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Сортировка:</label>
            <select 
              className="form-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="deadline">По сроку</option>
              <option value="priority">По приоритету</option>
              <option value="created">По дате создания</option>
            </select>
          </div>
        </div>
      </div>

      {!tasks || tasks.length === 0 ? (
        <div className="no-tasks-container">
          <p className="no-tasks">Нет задач</p>
          <p className="no-tasks-hint">Нажмите "Добавить задачу", чтобы создать новую задачу</p>
        </div>
      ) : (
        <div className="task-board">
          {groupTasksByStatus().map(group => (
            <div 
              key={group.status._id} 
              className="task-column"
            >
              <div 
                className="task-column-header" 
                style={{ borderBottom: `2px solid ${group.status.color || '#4364f7'}` }}
              >
                <h3 className="column-title">{group.status.name}</h3>
                <span 
                  className="task-count"
                  style={{ backgroundColor: group.status.color || '#4364f7', color: '#fff' }}
                >
                  {group.tasks.length}
                </span>
              </div>
              <div className="task-column-body">
                {group.tasks.length === 0 ? (
                  <div className="empty-column-hint">
                    <p>Нет задач в этом статусе</p>
                  </div>
                ) : (
                  group.tasks.map(task => (
                    <TaskItem key={task._id} task={task} />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;