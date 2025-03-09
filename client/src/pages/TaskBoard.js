// client/src/pages/TaskBoard.js
import React, { useContext, useEffect, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import { StatusContext } from '../context/StatusContext';
import TaskItem from '../components/tasks/TaskItem';
import Spinner from '../components/layout/Spinner';
import { Link } from 'react-router-dom';

const TaskBoard = () => {
  const taskContext = useContext(TaskContext);
  const statusContext = useContext(StatusContext);
  
  const { tasks, loading, getTasks } = taskContext;
  const { statuses, getStatuses } = statusContext;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOption, setSortOption] = useState('deadline');
  
  useEffect(() => {
    getTasks();
    getStatuses();
    // eslint-disable-next-line
  }, []);
  
  if (loading) {
    return <Spinner />;
  }
  
  // Группировка задач по статусам
  const groupTasksByStatus = () => {
    const groupedTasks = {};
    
    if (statuses) {
      statuses.forEach(status => {
        groupedTasks[status._id] = {
          status,
          tasks: []
        };
      });
      
      // Фильтрация и сортировка
      let filteredTasks = tasks || [];
      
      // Поиск
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredTasks = filteredTasks.filter(task => 
          (task.title && task.title.toLowerCase().includes(term)) || 
          (task.description && task.description.toLowerCase().includes(term))
        );
      }
      
      // Фильтр по категории
      if (categoryFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => 
          task.category === categoryFilter
        );
      }
      
      // Распределение по статусам
      filteredTasks.forEach(task => {
        if (task.status && groupedTasks[task.status._id]) {
          groupedTasks[task.status._id].tasks.push(task);
        }
      });
    }
    
    return Object.values(groupedTasks);
  };
  
  return (
    <div className="task-board-container">
      <div className="task-board-header">
        <h2 className="task-board-title">Доска задач</h2>
        
        <div className="task-board-controls">
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
          
          <div className="filter-container">
            <select 
              className="filter-select"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="all">Все категории</option>
              <option value="development">Разработка</option>
              <option value="design">Дизайн</option>
              <option value="marketing">Маркетинг</option>
            </select>
            
            <select 
              className="filter-select"
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
            >
              <option value="deadline">По сроку</option>
              <option value="priority">По приоритету</option>
              <option value="created">По дате создания</option>
            </select>
          </div>
          
          <Link to="/tasks/new" className="btn-add-task">
            <i className="fas fa-plus"></i> Добавить задачу
          </Link>
        </div>
      </div>
      
      <div className="kanban-board">
        {groupTasksByStatus().map(group => (
          <div key={group.status._id} className="kanban-column">
            <div className="kanban-column-header">
              <div className="kanban-column-title">
                {group.status.name}
                <span className="kanban-count">{group.tasks.length}</span>
              </div>
            </div>
            <div className="kanban-column-body">
              {group.tasks.length === 0 ? (
                <div className="empty-column-message">Нет задач в этом статусе</div>
              ) : (
                group.tasks.map(task => (
                  <TaskItem key={task._id} task={task} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;