// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// React 18のcreateRoot APIを使ってアプリをレンダリング
const root = ReactDOM.createRoot(document.getElementById('root')); // createRootを使用
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
