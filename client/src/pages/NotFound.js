import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <h2>404 - Страница не найдена</h2>
      <p>Запрашиваемая страница не существует.</p>
      <Link to="/" className="btn btn-primary">
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFound;