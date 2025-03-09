import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Spinner from '../layout/Spinner';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState('');

  const authContext = useContext(AuthContext);
  const { user } = authContext;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/users');
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await axios.put(`/api/users/${userId}/role`, { role: newRole });
      setUsers(users.map(user => (user._id === userId ? res.data : user)));
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setRole(user.role);
  };

  const closeRoleModal = () => {
    setSelectedUser(null);
    setRole('');
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="user-list">
      <h3>Пользователи</h3>
      
      <table className="users-table">
        <thead>
          <tr>
            <th>Имя</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Дата регистрации</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <span className={`role-badge role-${u.role}`}>
                  {u.role === 'admin' ? 'Администратор' : 
                   u.role === 'manager' ? 'Менеджер' : 'Сотрудник'}
                </span>
              </td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td>
                {user._id !== u._id && (
                  <button onClick={() => openRoleModal(u)} className="btn btn-sm btn-secondary">
                    <i className="fas fa-user-cog"></i> Изменить роль
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h4>Изменение роли пользователя</h4>
              <button onClick={closeRoleModal} className="close-btn">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>
                Пользователь: <strong>{selectedUser.name}</strong>
              </p>
              <div className="form-group">
                <label htmlFor="role">Роль</label>
                <select
                  name="role"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                >
                  <option value="worker">Сотрудник</option>
                  <option value="manager">Менеджер</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => handleRoleChange(selectedUser._id, role)} className="btn btn-primary">
                Сохранить
              </button>
              <button onClick={closeRoleModal} className="btn btn-secondary">
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;