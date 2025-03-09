import React, { createContext, useReducer } from 'react';
import axios from 'axios';
import settingsReducer from './reducers/settingsReducer';

// Начальное состояние
const initialState = {
  settings: null,
  loading: true,
  error: null
};

// Создание контекста
export const SettingsContext = createContext(initialState);

// Провайдер контекста
export const SettingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  // Получение настроек
  const getSettings = async () => {
    try {
      const res = await axios.get('/api/settings');

      dispatch({
        type: 'GET_SETTINGS',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'SETTINGS_ERROR',
        payload: err.response?.data?.msg || 'Ошибка загрузки настроек'
      });
    }
  };

  // Обновление настроек
  const updateSettings = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put('/api/settings', formData, config);

      dispatch({
        type: 'UPDATE_SETTINGS',
        payload: res.data
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: 'SETTINGS_ERROR',
        payload: err.response?.data?.msg || 'Ошибка обновления настроек'
      });
      return null;
    }
  };

  // Очистка ошибок
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  return (
    <SettingsContext.Provider
      value={{
        settings: state.settings,
        loading: state.loading,
        error: state.error,
        getSettings,
        updateSettings,
        clearErrors
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};