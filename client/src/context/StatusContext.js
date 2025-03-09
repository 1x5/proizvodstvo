import React, { createContext, useReducer } from 'react';
import axios from 'axios';
import statusReducer from './reducers/statusReducer';

// Начальное состояние
const initialState = {
  statuses: [],
  loading: true,
  error: null
};

// Создание контекста
export const StatusContext = createContext(initialState);

// Провайдер контекста
export const StatusProvider = ({ children }) => {
  const [state, dispatch] = useReducer(statusReducer, initialState);

  // Получение всех статусов
  const getStatuses = async () => {
    try {
      const res = await axios.get('/api/statuses');

      dispatch({
        type: 'GET_STATUSES',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'STATUS_ERROR',
        payload: err.response?.data?.msg || 'Ошибка получения статусов'
      });
    }
  };

  // Создание нового статуса
  const createStatus = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('/api/statuses', formData, config);

      dispatch({
        type: 'ADD_STATUS',
        payload: res.data
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: 'STATUS_ERROR',
        payload: err.response?.data?.msg || 'Ошибка создания статуса'
      });
      return null;
    }
  };

  // Обновление статуса
  const updateStatus = async (id, formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put(`/api/statuses/${id}`, formData, config);

      dispatch({
        type: 'UPDATE_STATUS',
        payload: res.data
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: 'STATUS_ERROR',
        payload: err.response?.data?.msg || 'Ошибка обновления статуса'
      });
      return null;
    }
  };

  // Обновление порядка статусов
  const updateStatusOrder = async (statusOrder) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put('/api/statuses', { statusOrder }, config);

      dispatch({
        type: 'UPDATE_STATUSES',
        payload: res.data
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: 'STATUS_ERROR',
        payload: err.response?.data?.msg || 'Ошибка обновления порядка статусов'
      });
      return null;
    }
  };

  // Удаление статуса
  const deleteStatus = async (id) => {
    try {
      await axios.delete(`/api/statuses/${id}`);

      dispatch({
        type: 'DELETE_STATUS',
        payload: id
      });
    } catch (err) {
      dispatch({
        type: 'STATUS_ERROR',
        payload: err.response?.data?.msg || 'Ошибка удаления статуса'
      });
    }
  };

  // Очистка ошибок
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  return (
    <StatusContext.Provider
      value={{
        statuses: state.statuses,
        loading: state.loading,
        error: state.error,
        getStatuses,
        createStatus,
        updateStatus,
        updateStatusOrder,
        deleteStatus,
        clearErrors
      }}
    >
      {children}
    </StatusContext.Provider>
  );
};