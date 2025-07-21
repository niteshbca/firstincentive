import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { username, password });
      if (res.data.status === 'success') {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/employee-dashboard');
      } else {
        setError(res.data.message || 'Invalid username or password');
      }
    } catch (err) {
      setError('Invalid username or password');
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
      background: linear-gradient(-45deg, #fcb900, #9900ef, #ff6900, #00ff07);
      background-size: 400% 400%;
      animation: gradientAnimation 12s ease infinite;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .login-container {
      background-color: rgba(218, 216, 224, 0.6);
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      width: 350px;
    }
    h2 {
      text-align: center;
      margin-bottom: 20px;
      color:white;
    }
    input {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #ddd;
      border-radius: 25px;
    }
    .btn {
      padding: 10px;
      margin-top: 10px;
      width: 100%;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      color: white;
      background-color:rgba(218, 216, 224, 0.8);
      font-size: 1rem;
    }
    .btn:hover {
      background-color:rgba(218, 216, 224, 0.5);
    }
    .error-message {
      color: red;
      margin-top: 10px;
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
        <h2>Employee Login</h2>
        <input
          type="text"
          placeholder="Enter User Name"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          className="btn"
          onClick={handleLogin}
        >
          Login
        </button>
        {error && <div className="error-message">{error}</div>}
        <button
          className="btn"
          style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid #fff', marginTop: 15 }}
          onClick={() => navigate('/')}
        >
          Back to Welcome
        </button>
      </div>
    </div>
  );
};

export default EmployeeLogin; 