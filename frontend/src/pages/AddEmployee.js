import React, { useState } from 'react';
import axios from 'axios';

const AddEmployee = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employees, setEmployees] = useState([]);
  const [showList, setShowList] = useState(false);

  const addEmployee = async () => {
    if (!username || !email || !password) {
      alert('Please fill out all fields.');
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/employees`, { name: username, email, password });
      setUsername('');
      setEmail('');
      setPassword('');
      showEmployees();
    } catch (err) {
      alert('Error adding employee');
    }
  };

  const showEmployees = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/employees`);
      setEmployees(res.data);
      setShowList(true);
    } catch (err) {
      alert('Error fetching employees');
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/employees/${id}`);
      showEmployees();
    } catch (err) {
      alert('Error deleting employee');
    }
  };

  const toggleEmployeeList = () => {
    if (showList) {
      setShowList(false);
    } else {
      showEmployees();
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
      padding: 10px;
      background: linear-gradient(-45deg, #fcb900, #9900ef, #ff6900, #00ff07);
      background-size: 400% 400%;
      animation: gradientAnimation 12s ease infinite;
    }
    .container {
      background-color: rgba(218, 216, 224, 0.6);
      padding: 20px;
      border-radius: 20px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 400px;
      margin: 10px;
    }
    h1 {
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
    .employee-list {
      margin-top: 20px;
      display: none;
    }
    .employee-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: rgba(218, 216, 224, 0.8);
      padding: 10px;
      margin-bottom: 10px;
      border-radius: 25px;
      border: 1px solid #ddd;
      flex-wrap: wrap;
    }
    .employee-item span {
      flex-grow: 1;
      margin-right: 10px;
      word-wrap: break-word;
    }
    .btn-delete {
      background-color: #e74c3c;
      border: none;
      padding: 5px 10px;
      color: white;
      cursor: pointer;
      border-radius: 5px;
    }
    .btn-delete:hover {
      background-color: #c0392b;
    }
    @media (max-width: 768px) {
      .container {
        max-width: 90%;
        padding: 15px;
      }
      .btn {
        font-size: 0.9rem;
      }
      input {
        padding: 8px;
      }
    }
    @media (max-width: 480px) {
      .container {
        max-width: 100%;
        padding: 10px;
      }
      .btn {
        font-size: 0.8rem;
      }
      input {
        padding: 6px;
      }
      .employee-item {
        flex-direction: column;
        align-items: flex-start;
      }
      .btn-delete {
        margin-top: 10px;
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
      <div className="container">
        <h1>Add Employee</h1>
        <input type="text" placeholder="Enter Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="email" placeholder="Enter Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Enter Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="btn" onClick={addEmployee}>Add Employee</button>
        <button className="btn" onClick={toggleEmployeeList}>{showList ? 'Hide Employees' : 'Show Employees'}</button>
        {showList && (
          <div className="employee-list" style={{ marginTop: 20, display: 'block' }}>
            {employees.map(emp => (
              <div key={emp._id} className="employee-item">
                <span>{emp.name} - {emp.email}</span>
                <button className="btn-delete" onClick={() => deleteEmployee(emp._id)}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddEmployee; 