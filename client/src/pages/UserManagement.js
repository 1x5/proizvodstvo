// client/src/pages/UserManagement.js
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import UserList from '../components/users/UserList';
import './UserManagement.css'; // Добавляем импорт стилей

const UserManagement = ({ history }) => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  useEffect(() => {
    // Проверка прав доступа
    if (user && user.role !== 'admin') {
      history.push('/tasks');
    }
    // eslint-disable-next-line
  }, [user]);

  return (
    <div className="user-management-page">
      <h2>Управление пользователями</h2>
      <UserList />
    </div>
  );
};

export default UserManagement;