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
  
  const { loading: statusLoading, getStatuses } = statusContext;
  const { loading: settingsLoading, getSettings } = settingsContext;
  const { tasks } = taskContext;
  
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    getStatuses();
    getSettings();
    // eslint-disable-next-line
  }, []);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleTaskAdded = () => {
    setShowForm(false);
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
    <div className="container">
      <div className="task-board-header">
        <h1 className="task-board-title">Доска задач</h1>
        <button onClick={toggleForm} className="add-task-btn">
          <i className="fas fa-plus"></i> {showForm ? 'Скрыть форму' : 'Добавить задачу'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <TaskForm onTaskAdded={handleTaskAdded} />
        </div>
      )}

      <div className="task-filters">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Поиск задач..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <select 
          className="filter-select"
          value={filterCategory}
          onChange={handleCategoryChange}
        >
          <option value="all">Все категории</option>
          <option value="development">Разработка</option>
          <option value="design">Дизайн</option>
          <option value="marketing">Маркетинг</option>
        </select>
      </div>

      <TaskList searchTerm={searchTerm} filterCategory={filterCategory} />
    </div>
  );
};

export default TaskBoard;