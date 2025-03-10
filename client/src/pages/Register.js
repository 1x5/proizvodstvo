// client/src/pages/Register.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css'; // Используем те же стили, что и для логина

const Register = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, error, clearErrors, isAuthenticated } = authContext;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);
  const [language, setLanguage] = useState('Русский');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/tasks');
    }
    
    if (error) {
      setFormError(error);
      clearErrors();
    }
    // eslint-disable-next-line
  }, [isAuthenticated, error]);

  const { name, email, password, password2 } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setFormError('');
    
    if (password !== password2) {
      setFormError('Пароли не совпадают');
      return;
    }
    
    if (name === '' || email === '' || password === '') {
      setFormError('Пожалуйста, заполните все поля');
      return;
    }
    
    setLoading(true);
    
    await register({
      name,
      email,
      password
    });
    
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePassword2Visibility = () => {
    setShowPassword2(!showPassword2);
  };

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  return (
    <div className={`login-page fullwidth ${darkTheme ? 'dark-theme' : ''}`}>
      <div className="login-container">
        <h1 className="login-title">Регистрация</h1>
        
        <form onSubmit={onSubmit}>
          <div className="input-group">
            <span className="input-icon">
              <i className="fas fa-user"></i>
            </span>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              className="input-field"
              placeholder="Ваше имя"
              required
            />
          </div>
          
          <div className="input-group">
            <span className="input-icon">
              <i className="fas fa-envelope"></i>
            </span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="input-field"
              placeholder="Email"
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
              minLength="6"
            />
            <button 
              type="button" 
              className="toggle-password"
              onClick={togglePasswordVisibility}
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          
          <div className="input-group">
            <span className="input-icon">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type={showPassword2 ? "text" : "password"}
              name="password2"
              value={password2}
              onChange={onChange}
              className="input-field password-input"
              placeholder="Подтвердите пароль"
              required
              minLength="6"
            />
            <button 
              type="button" 
              className="toggle-password"
              onClick={togglePassword2Visibility}
            >
              <i className={`fas ${showPassword2 ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          
          {formError && <div className="error-message">{formError}</div>}
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        
        <div className="register-link">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
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

export default Register;