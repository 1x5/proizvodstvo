// client/src/App.js
import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { StatusProvider } from './context/StatusContext';
import { SettingsProvider, SettingsContext } from './context/SettingsContext';
import PrivateRoute from './components/routing/PrivateRoute';
import Sidebar from './components/layout/Sidebar';
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
  <div>
    <h2 className="page-title">Календарь</h2>
    <p>Раздел в разработке</p>
  </div>
);

const Reports = () => (
  <div>
    <h2 className="page-title">Отчеты</h2>
    <p>Раздел в разработке</p>
  </div>
);

const Clients = () => (
  <div>
    <h2 className="page-title">Клиенты</h2>
    <p>Раздел в разработке</p>
  </div>
);

// Проверка наличия токена
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

// Компонент для условного рендеринга навигационной панели и боковой панели
const AppLayout = ({ children }) => {
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const settingsContext = useContext(SettingsContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { isAuthenticated } = authContext;
  const { theme } = settingsContext;
  
  // Скрываем боковую панель на страницах входа и регистрации
  const hideNavigation = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';
  
  // Обрабатываем изменение размера окна для мобильной версии
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Проверяем при монтировании
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Закрываем мобильное меню при изменении маршрута
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Определяем классы для основного содержимого
  const contentClasses = `main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${hideNavigation ? 'no-sidebar' : ''}`;
  
  return (
    <>
      {isAuthenticated && !hideNavigation && (
        <>
          <Sidebar 
            collapsed={sidebarCollapsed} 
            toggleCollapse={toggleSidebar} 
            mobileOpen={mobileMenuOpen} 
            closeMobileMenu={() => setMobileMenuOpen(false)}
          />
          {mobileMenuOpen && (
            <div className="sidebar-overlay" onClick={() => setMobileMenuOpen(false)} />
          )}
        </>
      )}
      
      {isAuthenticated && !hideNavigation && window.innerWidth <= 768 && (
        <div className="mobile-header">
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <i className="fas fa-bars"></i>
          </button>
          <div className="logo">
            {/* Логотип или название компании */}
          </div>
          <div className="user-avatar-mobile">
            <i className="fas fa-user"></i>
          </div>
        </div>
      )}
      
      <div className={contentClasses}>
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