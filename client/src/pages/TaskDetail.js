import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import { StatusContext } from '../context/StatusContext';
import { AuthContext } from '../context/AuthContext';
import moment from 'moment';
import 'moment/locale/ru';
import Spinner from '../components/layout/Spinner';

moment.locale('ru');

const TaskDetail = () => {
  const taskContext = useContext(TaskContext);
  const statusContext = useContext(StatusContext);
  const authContext = useContext(AuthContext);

  const { currentTask, loading, getTaskById, updateTask, addNote, uploadFile, deleteFile, deleteTask } = taskContext;
  const { statuses, getStatuses } = statusContext;
  const { user } = authContext;

  const [note, setNote] = useState('');
  const [file, setFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    priority: '',
    status: '',
    dueDate: null
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getTaskById(id);
    getStatuses();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (currentTask) {
      setEditData({
        title: currentTask.title,
        description: currentTask.description || '',
        priority: currentTask.priority,
        status: currentTask.status._id,
        dueDate: currentTask.dueDate ? new Date(currentTask.dueDate) : null
      });
    }
  }, [currentTask]);

  if (loading || !currentTask) {
    return <Spinner />;
  }

  const handleNoteSubmit = async e => {
    e.preventDefault();
    if (note.trim() === '') return;

    await addNote(currentTask._id, note);
    setNote('');
  };

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async e => {
    e.preventDefault();
    if (!file) return;

    await uploadFile(currentTask._id, file);
    setFile(null);
    // Сбросить значение input
    e.target.reset();
  };

  const handleFileDelete = async fileId => {
    if (window.confirm('Вы уверены, что хотите удалить этот файл?')) {
      await deleteFile(fileId, currentTask._id);
    }
  };

  const handleTaskDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      await deleteTask(currentTask._id);
      navigate('/tasks');
    }
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    await updateTask(currentTask._id, editData);
    setEditMode(false);
  };

  const renderTaskDetails = () => (
    <>
      <div className="task-header">
        <h2>{currentTask.title}</h2>
        <div className="task-actions">
          <button onClick={() => setEditMode(true)} className="btn btn-secondary">
            <i className="fas fa-edit"></i> Редактировать
          </button>
          {(user && user.role === 'admin' || (currentTask.createdBy && currentTask.createdBy._id === user._id)) && (
            <button onClick={handleTaskDelete} className="btn btn-danger">
              <i className="fas fa-trash-alt"></i> Удалить
            </button>
          )}
        </div>
      </div>

      <div className="task-metadata">
        <div className="metadata-item">
          <span className="metadata-label">Статус:</span>
          <span 
            className="metadata-value status"
            style={{ backgroundColor: currentTask.status.color || '#3498db', color: '#fff', padding: '3px 8px', borderRadius: '3px' }}
          >
            {currentTask.status.name}
          </span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Приоритет:</span>
          <span className="metadata-value">
            {currentTask.priority === 'high' ? 'Высокий' : 
             currentTask.priority === 'medium' ? 'Средний' : 'Низкий'}
          </span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Создано:</span>
          <span className="metadata-value">{moment(currentTask.createdAt).format('LLL')}</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Создатель:</span>
          <span className="metadata-value">{currentTask.createdBy && currentTask.createdBy.name}</span>
        </div>
        {currentTask.dueDate && (
          <div className="metadata-item">
            <span className="metadata-label">Срок выполнения:</span>
            <span className="metadata-value">{moment(currentTask.dueDate).format('LL')}</span>
          </div>
        )}
      </div>

      <div className="task-description">
        <h3>Описание</h3>
        <p>{currentTask.description || 'Нет описания'}</p>
      </div>

      {/* Пользовательские поля */}
      {currentTask.customFields && Object.keys(currentTask.customFields).length > 0 && (
        <div className="task-custom-fields">
          <h3>Дополнительные поля</h3>
          <div className="custom-fields-list">
            {Object.entries(currentTask.customFields).map(([key, value]) => (
              <div key={key} className="custom-field-item">
                <span className="custom-field-label">{key}:</span>
                <span className="custom-field-value">
                  {typeof value === 'boolean' 
                    ? (value ? 'Да' : 'Нет') 
                    : (value instanceof Date 
                      ? moment(value).format('LL') 
                      : value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Вложения */}
      <div className="task-attachments">
        <h3>Вложения</h3>
        <form onSubmit={handleFileUpload} className="file-upload-form">
          <div className="file-input-group">
            <input type="file" onChange={handleFileChange} className="file-input" />
            <button type="submit" className="btn btn-primary btn-sm">
              <i className="fas fa-upload"></i> Загрузить
            </button>
          </div>
        </form>

        <div className="attachments-list">
          {currentTask.attachments && currentTask.attachments.length > 0 ? (
            currentTask.attachments.map(file => (
              <div key={file._id} className="attachment-item">
                <a href={`/api/files/${file._id}`} target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-file"></i> {file.originalName}
                </a>
                <button 
                  onClick={() => handleFileDelete(file._id)} 
                  className="btn btn-danger btn-sm"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))
          ) : (
            <p>Нет вложений</p>
          )}
        </div>
      </div>

      {/* Заметки */}
      <div className="task-notes">
        <h3>Заметки</h3>
        <form onSubmit={handleNoteSubmit} className="note-form">
          <div className="form-group">
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Добавить заметку..."
              rows="3"
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">
            <i className="fas fa-comment"></i> Добавить заметку
          </button>
        </form>

        <div className="notes-list">
          {currentTask.notes && currentTask.notes.length > 0 ? (
            currentTask.notes.map((note, index) => (
              <div key={index} className="note-item">
                <div className="note-header">
                  <span className="note-author">{note.createdBy && note.createdBy.name}</span>
                  <span className="note-date">{moment(note.createdAt).format('LLL')}</span>
                </div>
                <div className="note-body">{note.text}</div>
              </div>
            ))
          ) : (
            <p>Нет заметок</p>
          )}
        </div>
      </div>
    </>
  );

  const renderEditForm = () => (
    <form onSubmit={handleEditSubmit} className="edit-task-form">
      <h2>Редактирование задачи</h2>
      <div className="form-group">
        <label htmlFor="title">Название <span className="required">*</span></label>
        <input
          type="text"
          name="title"
          value={editData.title}
          onChange={e => setEditData({ ...editData, title: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Описание</label>
        <textarea
          name="description"
          value={editData.description}
          onChange={e => setEditData({ ...editData, description: e.target.value })}
          rows="4"
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="priority">Приоритет</label>
        <select
          name="priority"
          value={editData.priority}
          onChange={e => setEditData({ ...editData, priority: e.target.value })}
        >
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="status">Статус <span className="required">*</span></label>
        <select
          name="status"
          value={editData.status}
          onChange={e => setEditData({ ...editData, status: e.target.value })}
          required
        >
          {statuses && statuses.map(status => (
            <option key={status._id} value={status._id}>
              {status.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="dueDate">Срок выполнения</label>
        <input
          type="date"
          name="dueDate"
          value={editData.dueDate ? moment(editData.dueDate).format('YYYY-MM-DD') : ''}
          onChange={e => setEditData({ 
            ...editData, 
            dueDate: e.target.value ? new Date(e.target.value) : null 
          })}
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Сохранить</button>
        <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>
          Отмена
        </button>
      </div>
    </form>
  );

  return (
    <div className="task-detail">
      {editMode ? renderEditForm() : renderTaskDetails()}
    </div>
  );
};

export default TaskDetail;