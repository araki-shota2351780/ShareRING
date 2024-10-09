// src/SignUpUI.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';  // スタイリングを追加

const SignUpUI = ({ onSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignUp();
  };

  return (
    <div className="auth-container">
      <h2>アカウント作成</h2>
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
        <button className="auth-button" type="submit">アカウント作成</button>
      </form>
      <p>
        すでにアカウントをお持ちの方は
        <button className="link-button" onClick={() => navigate('/')}>ログイン</button>
      </p>
    </div>
  );
};

export default SignUpUI;
