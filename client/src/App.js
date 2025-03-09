// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { StatusProvider } from './context/StatusContext';
import { SettingsProvider } from './context/SettingsContext';
import PrivateRoute from './components/routing/PrivateRoute';
import Navbar from './components/layout/Navbar';
import { Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskBoard from './pages/TaskBoard';
import TaskDetail from './pages/TaskDetail';
import Settings from './pages/Settings';
import UserManagement from './pages/UserManagement';
import NotFound from './pages/NotFound';
import setAuthToken from './utils/setAuthToken';
import './App.css';

// Временные компоненты-заглушки для новых разделов
const Calendar = () => (
  <div className="container">
    <h2 className="page-title">Календарь</h2>
    <p>Раздел в разработке</p>
  </div>
);

const Reports = () => (
  <div className="container">
    <h2 className="page-title">Отчеты</h2>
    <p>Раздел в разработке</p>
  </div>
);

const Clients = () => (
  <div className="container">
    <h2 className="page-title">Клиенты</h2>
    <p>Раздел в разработке</p>
  </div>
);

// Проверка наличия токена
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  // Домашняя страница определена непосредственно здесь
  const Home = () => (
    <div className="home-container">
      <h1 className="home-title">Система управления производством</h1>
      <p className="home-subtitle">
        Универсальное решение для управления производственными задачами и рабочими процессами
      </p>
      <div className="home-buttons">
        <Link to="/register" className="btn btn-primary">Регистрация</Link>
        <Link to="/login" className="btn btn-outline">Вход</Link>
      </div>
    </div>
  );

  return (
    <AuthProvider>
      <SettingsProvider>
        <StatusProvider>
          <TaskProvider>
            <Router>
              <div className="app-container">
                <Navbar />
                <div className="container">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                      path="/tasks" 
                      element={
                        <PrivateRoute>
                          <TaskBoard />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/tasks/:id" 
                      element={
                        <PrivateRoute>
                          <TaskDetail />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/calendar" 
                      element={
                        <PrivateRoute>
                          <Calendar />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/reports" 
                      element={
                        <PrivateRoute>
                          <Reports />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/clients" 
                      element={
                        <PrivateRoute>
                          <Clients />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/settings" 
                      element={
                        <PrivateRoute>
                          <Settings />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/users" 
                      element={
                        <PrivateRoute>
                          <UserManagement />
                        </PrivateRoute>
                      } 
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </div>
            </Router>
          </TaskProvider>
        </StatusProvider>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;