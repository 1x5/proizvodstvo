// client/src/components/layout/Navbar.js
import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { SettingsContext } from '../../context/SettingsContext';
import './Navbar.css'; // Создайте этот файл для стилей навигации

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const settingsContext = useContext(SettingsContext);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { isAuthenticated, user, logout } = authContext;
  const { settings, getSettings } = settingsContext;

  useEffect(() => {
    if (isAuthenticated) {
      getSettings();
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  // Закрывать мобильное меню при изменении маршрута
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const onLogout = () => {
    logout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/') ? 'active' : '';
  };

  const authLinks = (
    <ul className={`nav-menu ${isMobileMenuOpen ? 'show' : ''}`}>
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
      <li className="nav-item-mobile">
        <a onClick={onLogout} href="#!" className="logout-btn">
          <i className="fas fa-sign-out-alt"></i>
          <span>Выход</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul className={`nav-menu ${isMobileMenuOpen ? 'show' : ''}`}>
      <li className={isActive('/register')}>
        <Link to="/register">
          <i className="fas fa-user-plus"></i>
          <span>Регистрация</span>
        </Link>
      </li>
      <li className={isActive('/login')}>
        <Link to="/login">
          <i className="fas fa-sign-in-alt"></i>
          <span>Вход</span>
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            {settings && settings.companyName ? settings.companyName : 'Система управления производством'}
          </Link>
        </div>
        
        <div className="menu-toggle" onClick={toggleMobileMenu}>
          <i className={isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>
        
        {isAuthenticated ? authLinks : guestLinks}
        
        {isAuthenticated && (
          <div className="nav-user-section">
            <div className="user-avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="user-info">
              <span className="user-name">{user && user.name}</span>
              <a onClick={onLogout} href="#!" className="logout-link">
                <i className="fas fa-sign-out-alt"></i> Выход
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;