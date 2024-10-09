// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// React 18��createRoot API���g���ăA�v���������_�����O
const root = ReactDOM.createRoot(document.getElementById('root')); // createRoot���g�p
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
