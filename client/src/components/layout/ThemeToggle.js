// client/src/components/layout/ThemeToggle.js
import React, { useContext, useState, useEffect, useRef } from 'react';
import { SettingsContext } from '../../context/SettingsContext';
import './ThemeToggle.css';

const ThemeToggle = ({ collapsed = false }) => {
  const settingsContext = useContext(SettingsContext);
  const { theme, toggleTheme } = settingsContext;
  const [expanded, setExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const nodeRef = useRef(null);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Обработка клика вне компонента для закрытия меню
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (nodeRef.current && !nodeRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div 
      className="theme-menu-item" 
      ref={nodeRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="theme-menu-header" onClick={toggleExpand}>
        <div className="theme-menu-icon">
          <i className="fas fa-lightbulb"></i>
        </div>
        {!collapsed && <span className="theme-menu-text">Theme</span>}
        {!collapsed && <i className={`fas ${expanded ? 'fa-chevron-up' : 'fa-chevron-down'} theme-menu-arrow`}></i>}
      </div>
      
      {/* Нормальное подменю для развернутой панели */}
      {!collapsed && expanded && (
        <div className="theme-submenu">
          <div className="theme-option">
            <span>Dark</span>
            <label className="theme-switch">
              <input 
                type="checkbox" 
                checked={theme === 'dark'} 
                onChange={toggleTheme} 
              />
              <span className="theme-slider"></span>
            </label>
          </div>
        </div>
      )}

      {/* Всплывающее меню для свернутой панели */}
      {collapsed && isHovering && (
        <div className="theme-hover-popup">
          <div className="theme-popup-header">Theme</div>
          <div className="theme-popup-content">
            <div className="theme-option">
              <span>Dark</span>
              <label className="theme-switch">
                <input 
                  type="checkbox" 
                  checked={theme === 'dark'} 
                  onChange={toggleTheme} 
                />
                <span className="theme-slider"></span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;