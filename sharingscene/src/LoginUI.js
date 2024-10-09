// src/LoginUI.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';  // スタイリングを追加

const LoginUI = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="auth-container">
      <h2>ログイン</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-input-group">
          <label>メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="auth-input-group">
          <label>パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="auth-button" type="submit">ログイン</button>
      </form>
      <p>
        アカウントがない方は
        <button className="link-button" onClick={() => navigate('/signup')}>アカウント作成</button>
      </p>
    </div>
  );
};

export default LoginUI;
