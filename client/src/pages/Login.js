// client/src/pages/Login.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const { login, error, clearErrors, isAuthenticated } = authContext;

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);
  const [language, setLanguage] = useState('Русский');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/tasks');
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    
    if (email === '' || password === '') {
      clearErrors();
      setLoading(false);
      return;
    }
    
    await login({
      email,
      password
    });
    
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  return (
    <div className={`login-page fullwidth ${darkTheme ? 'dark-theme' : ''}`}>
      <div className="login-container">
        <h1 className="login-title">Привет</h1>
        
        <form onSubmit={onSubmit}>
          <div className="input-group">
            <span className="input-icon">
              <i className="fas fa-user"></i>
            </span>
            <input
              type="text"
              name="email"
              value={email}
              onChange={onChange}
              className="input-field"
              placeholder="Логин"
              required
            />
          </div>
          
          <div className="input-group">
            <span className="input-icon">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={onChange}
              className="input-field password-input"
              placeholder="Пароль"
              required
            />
            <button 
              type="button" 
              className="toggle-password"
              onClick={togglePasswordVisibility}
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Логин'}
          </button>
        </form>
        
        <div className="register-link">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </div>
        
        <div className="language-selector">
          <img src="/images/ru-flag.svg" alt="Russian Flag" className="language-flag" />
          <span className="language-name">{language}</span>
          <i className="fas fa-chevron-down language-dropdown"></i>
        </div>
        
        <div className="theme-toggle">
          <i className="fas fa-lightbulb theme-toggle-label"></i>
          <label className="theme-switch">
            <input type="checkbox" checked={darkTheme} onChange={toggleTheme} />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Login;