// client/src/components/layout/ThemeToggle.js
import React, { useContext } from 'react';
import { SettingsContext } from '../../context/SettingsContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const settingsContext = useContext(SettingsContext);
  const { theme, toggleTheme } = settingsContext;

  return (
    <div className="theme-toggle">
      <label className="switch">
        <input 
          type="checkbox" 
          checked={theme === 'dark'} 
          onChange={toggleTheme} 
        />
        <span className="slider"></span>
      </label>
      <i className={`fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`}></i>
    </div>
  );
};

export default ThemeToggle;