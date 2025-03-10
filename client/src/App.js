// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { StatusProvider } from './context/StatusContext';
import { SettingsProvider } from './context/SettingsContext';
import PrivateRoute from './components/routing/PrivateRoute';
import Navbar from './components/layout/Navbar';
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

// Компонент для условного рендеринга навигационной панели
const AppLayout = ({ children }) => {
  const location = useLocation();
  
  // Скрываем навигацию на страницах входа и регистрации
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';
  
  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className={hideNavbar ? 'container-no-navbar' : 'container'}>
        {children}
      </div>
    </>
  );
};

const App = () => {
  // Домашняя страница определена непосредственно здесь
  const Home = () => <Login />;

  return (
    <AuthProvider>
      <SettingsProvider>
        <StatusProvider>
          <TaskProvider>
            <Router>
              <div className="app-container">
                <Routes>
                  <Route path="/" element={
                    <AppLayout>
                      <Home />
                    </AppLayout>
                  } />
                  <Route path="/login" element={
                    <AppLayout>
                      <Login />
                    </AppLayout>
                  } />
                  <Route path="/register" element={
                    <AppLayout>
                      <Register />
                    </AppLayout>
                  } />
                  <Route path="/tasks" element={
                    <AppLayout>
                      <PrivateRoute>
                        <TaskBoard />
                      </PrivateRoute>
                    </AppLayout>
                  } />
                  <Route path="/tasks/:id" element={
                    <AppLayout>
                      <PrivateRoute>
                        <TaskDetail />
                      </PrivateRoute>
                    </AppLayout>
                  } />
                  <Route path="/calendar" element={
                    <AppLayout>
                      <PrivateRoute>
                        <Calendar />
                      </PrivateRoute>
                    </AppLayout>
                  } />
                  <Route path="/reports" element={
                    <AppLayout>
                      <PrivateRoute>
                        <Reports />
                      </PrivateRoute>
                    </AppLayout>
                  } />
                  <Route path="/clients" element={
                    <AppLayout>
                      <PrivateRoute>
                        <Clients />
                      </PrivateRoute>
                    </AppLayout>
                  } />
                  <Route path="/settings" element={
                    <AppLayout>
                      <PrivateRoute>
                        <Settings />
                      </PrivateRoute>
                    </AppLayout>
                  } />
                  <Route path="/users" element={
                    <AppLayout>
                      <PrivateRoute>
                        <UserManagement />
                      </PrivateRoute>
                    </AppLayout>
                  } />
                  <Route path="*" element={
                    <AppLayout>
                      <NotFound />
                    </AppLayout>
                  } />
                </Routes>
              </div>
            </Router>
          </TaskProvider>
        </StatusProvider>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;