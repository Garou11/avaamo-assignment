import React from 'react';
import './errors.css';

export const ErrorMessageViewer = ({errorMessage}) => {
  return (
    <div className={`error-message ${errorMessage ? 'show' : ''}`} style={{ display: errorMessage ? 'block' : 'none' }}>
      <span>Error! {errorMessage}</span>
    </div>
  );
};