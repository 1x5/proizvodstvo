// client/src/pages/TaskBoard.js
import React, { useContext, useEffect, useState } from 'react';
import { StatusContext } from '../context/StatusContext';
import { SettingsContext } from '../context/SettingsContext';
import { TaskContext } from '../context/TaskContext';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import Spinner from '../components/layout/Spinner';
import './TaskBoard.css';

const TaskBoard = () => {
  const statusContext = useContext(StatusContext);
  const settingsContext = useContext(SettingsContext);
  const taskContext = useContext(TaskContext);
  
  const { loading: statusLoading, statuses, getStatuses } = statusContext;
  const { loading: settingsLoading, settings, getSettings } = settingsContext;
  const { tasks, getTasks } = taskContext;
  
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    getStatuses();
    getSettings();
    getTasks();
    // eslint-disable-next-line
  }, []);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleTaskAdded = () => {
    setShowForm(false);
    getTasks(); // Обновление списка задач после добавления
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setFilterCategory(e.target.value);
  };

  if (statusLoading || settingsLoading) {
    return <Spinner />;
  }

  return (
    <div className="task-board-container">
      <div className="task-board-header">
        <h1 className="task-board-title">Доска задач</h1>
        <button onClick={toggleForm} className="btn btn-primary add-task-btn">
          <i className="fas fa-plus"></i> {showForm ? 'Скрыть форму' : 'Добавить задачу'}
        </button>
      </div>

      {showForm && <TaskForm onTaskAdded={handleTaskAdded} />}

      <div className="task-filters">
        <div className="filter-row">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Поиск задач..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="filter-group">
            <select 
              className="form-control"
              value={filterCategory}
              onChange={handleCategoryChange}
            >
              <option value="all">Все категории</option>
              {settings && settings.categories && settings.categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <TaskList 
        searchTerm={searchTerm} 
        filterCategory={filterCategory} 
        onAddTask={toggleForm}
      />
    </div>
  );
};

export default TaskBoard;