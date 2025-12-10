import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/scss/reset.scss';
import '../../styles/scss/layout.scss';
import '../../styles/scss/404-not-found.scss';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <img src="/assets/not-found.png" alt="404 not found" className="not-found-image" />
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">Page Not Found</p>
        <button 
          className="back-home-btn"
          onClick={() => navigate('/main')}
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
