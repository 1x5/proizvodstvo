// client/src/context/AuthContext.js
import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import authReducer from './reducers/authReducer';
import setAuthToken from '../utils/setAuthToken';

// Начальное состояние
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  error: null
};

// Создание контекста
export const AuthContext = createContext(initialState);

// Провайдер контекста
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Загрузка пользователя при инициализации
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      loadUser();
    }
    // eslint-disable-next-line
  }, []);

  // Загрузка пользователя
  const loadUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');

      dispatch({
        type: 'USER_LOADED',
        payload: res.data
      });
    } catch (err) {
      console.error('Ошибка загрузки пользователя:', err);
      dispatch({
        type: 'AUTH_ERROR'
      });
    }
  };

  // Регистрация пользователя
  const register = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      console.log('Отправка запроса на регистрацию...');
      const res = await axios.post('/api/auth/register', formData, config);
      console.log('Ответ от сервера (регистрация):', res.data);

      // Явно сохраняем токен в localStorage
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        setAuthToken(res.data.token);
      }

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data
      });

      loadUser();
    } catch (err) {
      console.error('Ошибка регистрации:', err.response?.data || err.message);
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response?.data?.msg || 'Ошибка регистрации'
      });
    }
  };

  // Вход пользователя
  const login = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      console.log('Отправка запроса на вход...');
      const res = await axios.post('/api/auth/login', formData, config);
      console.log('Ответ от сервера (вход):', res.data);

      // Явно сохраняем токен в localStorage
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        setAuthToken(res.data.token);
      }

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });

      loadUser();
    } catch (err) {
      console.error('Ошибка входа:', err.response?.data || err.message);
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.msg || 'Неверные учетные данные'
      });
    }
  };

  // Выход пользователя
  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    dispatch({ type: 'LOGOUT' });
  };

  // Очистка ошибок
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        loadUser,
        clearErrors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};