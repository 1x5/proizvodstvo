import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SettingsContext } from '../context/SettingsContext';

const Home = ({ history }) => {
  const authContext = useContext(AuthContext);
  const settingsContext = useContext(SettingsContext);

  const { isAuthenticated, loadUser } = authContext;
  const { settings, getSettings } = settingsContext;

  useEffect(() => {
    loadUser();
    getSettings();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="home-page">
      <div className="home-content">
        <h1>
          {settings ? settings.companyName : 'Система управления производством'}
        </h1>
        <p className="lead">
          Универсальное решение для управления производственными задачами и рабочими процессами
        </p>
        <div className="home-actions">
          <Link to="/register" className="btn btn-primary">
            Регистрация
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Вход
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
