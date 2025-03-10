// client/src/components/layout/Sidebar.js
import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { SettingsContext } from '../../context/SettingsContext';
import ThemeToggle from './ThemeToggle';
import './Sidebar.css';

const Sidebar = () => {
  const authContext = useContext(AuthContext);
  const settingsContext = useContext(SettingsContext);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  const { isAuthenticated, user, logout } = authContext;
  const { settings } = settingsContext;

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const onLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/') ? 'active' : '';
  };

  // Если пользователь не авторизован, не показываем боковую панель
  if (!isAuthenticated) return null;

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <Link to="/">
            {settings && settings.companyName ? settings.companyName : 'Lamp812'}
          </Link>
        </div>
        <button className="collapse-btn" onClick={toggleSidebar}>
          <i className={`fas ${collapsed ? 'fa-angle-right' : 'fa-angle-left'}`}></i>
        </button>
      </div>

      <div className="theme-section">
        <div className="theme-label">Theme</div>
        <ThemeToggle />
      </div>

      <div className="sidebar-menu">
        <ul>
          <li className={isActive('/tasks')}>
            <Link to="/tasks">
              <i className="fas fa-tasks"></i>
              <span>Задачи</span>
            </Link>
          </li>
          <li className={isActive('/calendar')}>
            <Link to="/calendar">
              <i className="fas fa-calendar-alt"></i>
              <span>Календарь</span>
            </Link>
          </li>
          <li className={isActive('/reports')}>
            <Link to="/reports">
              <i className="fas fa-chart-bar"></i>
              <span>Отчеты</span>
            </Link>
          </li>
          <li className={isActive('/clients')}>
            <Link to="/clients">
              <i className="fas fa-users"></i>
              <span>Клиенты</span>
            </Link>
          </li>
          {user && user.role === 'admin' && (
            <>
              <li className={isActive('/users')}>
                <Link to="/users">
                  <i className="fas fa-user-cog"></i>
                  <span>Пользователи</span>
                </Link>
              </li>
              <li className={isActive('/settings')}>
                <Link to="/settings">
                  <i className="fas fa-cog"></i>
                  <span>Настройки</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            <i className="fas fa-user"></i>
          </div>
          <div className="user-details">
            <span className="user-name">{user && user.name}</span>
            <span className="user-role">{user && user.role}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Выход</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;