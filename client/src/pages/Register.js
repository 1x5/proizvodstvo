// client/src/pages/Register.js
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = ({ history }) => {
  const authContext = useContext(AuthContext);
  const { register, error, clearErrors, isAuthenticated } = authContext;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const [alert, setAlert] = useState(null);

  const { name, email, password, password2 } = formData;

  useEffect(() => {
    if (isAuthenticated) {
      history.push('/tasks');
    }

    if (error) {
      setAlert(error);
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, history]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Пароли не совпадают');
    } else {
      register({
        name,
        email,
        password,
        role: 'worker' // По умолчанию - сотрудник
      });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <h2>Регистрация в системе</h2>
        {alert && <div className="alert alert-danger">{alert}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">Имя</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password2">Подтверждение пароля</label>
            <input
              type="password"
              name="password2"
              value={password2}
              onChange={onChange}
              required
              minLength="6"
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary btn-block">
              Зарегистрироваться
            </button>
          </div>
        </form>
        <p className="auth-link">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;