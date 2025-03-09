// client/src/pages/Login.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css'; // Убедитесь, что создали этот файл с CSS стилями

const Login = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const { login, error, clearErrors, isAuthenticated } = authContext;

  const [user, setUser] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/tasks');
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const { email, password } = user;

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

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

  const handleGoogleLogin = () => {
    // Здесь можно добавить логику для входа через Google
    alert('Функция входа через Google пока не реализована');
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <div className="login-header">
          <div className="logo">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 3L23.9282 8.92823L29.8564 14.8565L23.9282 20.7847L18 26.713L12.0718 20.7847L6.14355 14.8565L12.0718 8.92823L18 3Z" fill="#CF4A2A"/>
              <path d="M18 9L20.8388 11.8388L23.6777 14.6777L20.8388 17.5165L18 20.3553L15.1612 17.5165L12.3223 14.6777L15.1612 11.8388L18 9Z" fill="#CF4A2A"/>
            </svg>
            <span>Производство</span>
          </div>
        </div>
        
        <div className="login-content">
          <div className="login-title">
            <h1>Ваше производство,<br/>под контролем</h1>
            <p>Система управления производственными процессами</p>
          </div>
          
          <div className="login-form-container">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="login-options">
              <button className="google-login" onClick={handleGoogleLogin}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google logo" />
                Продолжить с Google
              </button>
              
              <div className="separator">
                <span>ИЛИ</span>
              </div>
              
              <form className="login-form" onSubmit={onSubmit}>
                <div className="form-group">
                  <input 
                    type="email" 
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder="Введите ваш email" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="password" 
                    name="password"
                    value={password}
                    onChange={onChange}
                    placeholder="Введите пароль" 
                    required 
                  />
                </div>
                <button 
                  type="submit" 
                  className="login-button"
                  disabled={loading}
                >
                  {loading ? 'Вход...' : 'Войти в систему'}
                </button>
              </form>
            </div>
            
            <div className="login-footer">
              <p>Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link></p>
              <p className="privacy-notice">Продолжая, вы принимаете наши <a href="#!">Условия использования</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;