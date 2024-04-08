import React from 'react';
import './errors.css';

export const ErrorMessageViewer = ({errorMessage}) => {
  return (
    <div className={`col-md-5 col-xs-12 error-message ${errorMessage ? 'show' : ''}`} style={{ display: errorMessage ? 'block' : 'none' }}>
      <span>Error! {errorMessage}</span>
    </div>
  );
};