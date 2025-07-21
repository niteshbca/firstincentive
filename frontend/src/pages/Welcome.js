import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
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
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: linear-gradient(-45deg, #fcb900, #9900ef, #ff6900, #00ff07);
      background-size: 400% 400%;
      animation: gradientAnimation 12s ease infinite;
    }
    .container {
      text-align: center;
      padding: 20px;
      background-color: rgba(218, 216, 224, 0.6);
      border-radius: 20px;
    }
    .welcome-text {
      font-size: 4rem;
      font-family: 'Arial', sans-serif;
      color: #fff;
      margin-bottom: 30px;
      animation: fadeIn 2s ease-in-out;
    }
    .buttons {
      display: flex;
      gap: 20px;
      justify-content: center;
    }
    .btn {
      padding: 15px 30px;
      font-size: 1.2rem;
      border: none;
      cursor: pointer;
      border-radius: 30px;
      background-color:rgba(218, 216, 224, 0.8);
      transition: background-color 0.3s, transform 0.3s;
      position: relative;
      overflow: hidden;
      color: white;
    }
    .btn:hover {
      background-color:rgba(218, 216, 224, 0.6);
      transform: translateY(-5px);
    }
    .btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(120deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.8));
      transition: left 0.5s ease;
    }
    .btn:hover::before {
      left: 100%;
    }
    @media (max-width: 768px) {
      .welcome-text {
        font-size: 2.5rem;
      }
      .btn {
        font-size: 1rem;
        padding: 10px 20px;
      }
    }
    @media (max-width: 480px) {
      .welcome-text {
        font-size: 2rem;
      }
      .btn {
        font-size: 0.9rem;
        padding: 8px 15px;
      }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes gradientAnimation {
      0% { background-position: 0% 50%; }
      25% { background-position: 50% 100%; }
      50% { background-position: 100% 50%; }
      75% { background-position: 50% 0%; }
      100% { background-position: 0% 50%; }
    }
      `}</style>
      <h1 className="welcome-text">Welcome</h1>
      <div className="container">
        
        <div className="buttons">
          <button className="btn" onClick={() => navigate('/admin-login')}>Admin</button>
          <button className="btn" onClick={() => navigate('/employee-login')}>Employee</button>
        </div>
      </div>
    </div>
  );
};

export default Welcome; 