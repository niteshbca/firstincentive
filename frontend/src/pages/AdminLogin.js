import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [adminName, setAdminName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (adminName === 'admin' && adminPassword === '123') {
      navigate('/admin-dashboard');
    } else {
      setError('Invalid admin name or password');
    }
  };

  return (
    <div>
      <style>{`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html {
      height: 100%;
      font-family: 'Arial', sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(-45deg, #fcb900, #9900ef, #ff6900, #00ff07);
      background-size: 400% 400%;
      animation: gradientAnimation 12s ease infinite;
    }
    .login-container {
      text-align: center;
      padding: 30px;
      background-color: rgba(218, 216, 224, 0.6);
      border-radius: 10px;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
      max-width: 350px;
      width: 100%;
    }
    h2 {
      font-size: 2.5rem;
      color: #fff;
      margin-bottom: 20px;
    }
    input {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: none;
      border-radius: 25px;
      font-size: 1rem;
    }
    input[type="text"], input[type="password"] {
      background-color: rgba(255, 255, 255, 0.8);
      color: #333;
    }
    .login-btn {
      padding: 12px;
      background-color:rgba(218, 216, 224, 0.8);
      border: none;
      color: white;
      border-radius: 25px;
      font-size: 1.1rem;
      cursor: pointer;
      width: 100%;
      margin-top: 20px;
      transition: background-color 0.3s, transform 0.3s;
    }
    .login-btn:hover {
      background-color:rgba(218, 216, 224, 0.6);
      transform: translateY(-5px);
    }
    .error-message {
      color: #ff4c4c;
      margin-top: 10px;
      font-size: 1rem;
    }
    @media (max-width: 768px) {
      h2 {
        font-size: 2rem;
      }
      input {
        font-size: 0.9rem;
      }
      .login-btn {
        font-size: 1rem;
      }
    }
    @media (max-width: 480px) {
      h2 {
        font-size: 1.5rem;
      }
      input {
        font-size: 0.8rem;
      }
      .login-btn {
        font-size: 0.9rem;
      }
    }
    @keyframes gradientAnimation {
      0% { background-position: 0% 50%; }
      25% { background-position: 50% 100%; }
      50% { background-position: 100% 50%; }
      75% { background-position: 50% 0%; }
      100% { background-position: 0% 50%; }
    }
      `}</style>
      <div className="login-container">
        <h2>Admin Login</h2>
        <input
          type="text"
          placeholder="Enter Admin Name"
          value={adminName}
          onChange={e => setAdminName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={adminPassword}
          onChange={e => setAdminPassword(e.target.value)}
          required
        />
        <button
          className="login-btn"
          onClick={handleLogin}
        >
          Login
        </button>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <button
          className="login-btn"
          style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid #fff', marginTop: 15 }}
          onClick={() => navigate('/')}
        >
          Back too Welcome
        </button>
      </div>
    </div>
  );
};

export default AdminLogin; 
