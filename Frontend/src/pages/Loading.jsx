import React from 'react';
import '../styles/loading.css';

const Loading = () => {
  return (
    <div className="spinner-overlay">
      <div className="loading-spinner"></div>
    </div>
  );
};

export default Loading;
