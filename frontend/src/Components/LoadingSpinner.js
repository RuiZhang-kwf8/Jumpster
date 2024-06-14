import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message }) => {
  return (
    <div className="overlay">
      <div className="spinner"></div>
      <div className="loading-message">{message}</div>
    </div>
  );
};

export default LoadingSpinner;