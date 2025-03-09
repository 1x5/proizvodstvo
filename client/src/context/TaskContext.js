// client/src/context/TaskContext.js
import React, { createContext, useReducer } from 'react';
import axios from 'axios';
import taskReducer from './reducers/taskReducer';

// Начальное состояние
const initialState = {
  tasks: [],
  currentTask: null,
  loading: true,
  error: null
};

// Создание контекста
export const TaskContext = createContext(initialState);

// Провайдер контекста
export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Получение всех задач
  const getTasks = async () => {
    try {
      const res = await axios.get('/api/tasks');

      dispatch({
        type: 'GET_TASKS',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response.data.msg
      });
    }
  };

  // Получение задачи по ID
  const getTaskById = async (id) => {
    try {
      const res = await axios.get(`/api/tasks/${id}`);

      dispatch({
        type: 'GET_TASK',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response.data.msg
      });
    }
  };

  // Создание новой задачи
  const createTask = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('/api/tasks', formData, config);

      dispatch({
        type: 'ADD_TASK',
        payload: res.data
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response.data.msg
      });
      return null;
    }
  };

  // Обновление задачи
  const updateTask = async (id, formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put(`/api/tasks/${id}`, formData, config);

      dispatch({
        type: 'UPDATE_TASK',
        payload: res.data
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response.data.msg
      });
      return null;
    }
  };

  // Добавление заметки к задаче
  const addNote = async (taskId, text) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post(`/api/tasks/${taskId}/notes`, { text }, config);

      dispatch({
        type: 'UPDATE_TASK',
        payload: res.data
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response.data.msg
      });
      return null;
    }
  };

  // Загрузка файла к задаче
  const uploadFile = async (taskId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskId', taskId);

    try {
      const res = await axios.post('/api/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      dispatch({
        type: 'FILE_UPLOADED',
        payload: { taskId, file: res.data }
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response.data.msg
      });
      return null;
    }
  };

  // Удаление файла
  const deleteFile = async (fileId, taskId) => {
    try {
      await axios.delete(`/api/files/${fileId}`);

      dispatch({
        type: 'FILE_DELETED',
        payload: { taskId, fileId }
      });
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response.data.msg
      });
    }
  };

  // Удаление задачи
  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);

      dispatch({
        type: 'DELETE_TASK',
        payload: id
      });
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response.data.msg
      });
    }
  };

  // Очистка текущей задачи
  const clearCurrentTask = () => {
    dispatch({ type: 'CLEAR_CURRENT_TASK' });
  };

  // Очистка ошибок
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        currentTask: state.currentTask,
        loading: state.loading,
        error: state.error,
        getTasks,
        getTaskById,
        createTask,
        updateTask,
        addNote,
        uploadFile,
        deleteFile,
        deleteTask,
        clearCurrentTask,
        clearErrors
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};