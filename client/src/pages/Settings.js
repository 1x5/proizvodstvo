import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SettingsContext } from '../context/SettingsContext';
import { StatusContext } from '../context/StatusContext';
import Spinner from '../components/layout/Spinner';
import StatusManager from '../components/settings/StatusManager';
import CustomFieldsManager from '../components/settings/CustomFieldsManager';

const Settings = ({ history }) => {
  const authContext = useContext(AuthContext);
  const settingsContext = useContext(SettingsContext);
  const statusContext = useContext(StatusContext);

  const { user } = authContext;
  const { settings, loading: settingsLoading, getSettings, updateSettings } = settingsContext;
  const { getStatuses, loading: statusLoading } = statusContext;

  const [formData, setFormData] = React.useState({
    companyName: ''
  });

  useEffect(() => {
    // Проверка прав доступа
    if (user && user.role !== 'admin') {
      history.push('/tasks');
    }

    getSettings();
    getStatuses();
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (settings) {
      setFormData({
        companyName: settings.companyName || ''
      });
    }
  }, [settings]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    await updateSettings(formData);
  };

  if (settingsLoading || statusLoading) {
    return <Spinner />;
  }

  return (
    <div className="settings-page">
      <h2>Настройки системы</h2>

      <div className="settings-section">
        <h3>Основные настройки</h3>
        <form onSubmit={onSubmit} className="settings-form">
          <div className="form-group">
            <label htmlFor="companyName">Название компании</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Сохранить
            </button>
          </div>
        </form>
      </div>

      <div className="settings-section">
        <StatusManager />
      </div>

      <div className="settings-section">
        <CustomFieldsManager />
      </div>
    </div>
  );
};

export default Settings;