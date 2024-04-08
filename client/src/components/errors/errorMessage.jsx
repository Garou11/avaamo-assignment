import React from 'react';

export const ErrorMessageViewer = ({errorMessage}) => {
  return (
    <div className="error-message" style={{ display: errorMessage ? 'block' : 'none' }}>
      <p>{errorMessage}</p>
    </div>
  );
};