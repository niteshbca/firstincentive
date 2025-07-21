import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [date, setDate] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [shift, setShift] = useState('');
  const [particulars, setParticulars] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [downtime, setDowntime] = useState('');
  const [mainDetails, setMainDetails] = useState([]);
  const [mainDetail, setMainDetail] = useState('');
  const [subDetails, setSubDetails] = useState([]);
  const [subDetail, setSubDetail] = useState('');
  const [detailValue, setDetailValue] = useState('');

  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    } else {
      navigate('/employee-login');
      return;
    }
    axios.get(`${process.env.REACT_APP_API_URL}/api/details/main`)
      .then(res => setMainDetails(res.data))
      .catch(() => setMainDetails([]));
  }, [navigate]);

  useEffect(() => {
    if (mainDetail) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/details/sub/${mainDetail}`)
        .then(res => setSubDetails(res.data))
        .catch(() => setSubDetails([]));
    } else {
      setSubDetails([]);
    }
  }, [mainDetail]);

  useEffect(() => {
    if (fromTime && toTime) {
      const from = new Date(`1970-01-01T${fromTime}`);
      let to = new Date(`1970-01-01T${toTime}`);
      if (to < from) to.setDate(to.getDate() + 1);
      const diffMs = to - from;
      const diffHours = diffMs / (1000 * 60 * 60);
      const hours = Math.floor(diffHours);
      const minutes = Math.floor((diffHours - hours) * 60);
      setDowntime(`${hours}h ${minutes}m`);
      setDetailValue(diffHours.toFixed(2));
    }
  }, [fromTime, toTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        dates: date,
        shift,
        particulars,
        from_time: fromTime,
        to_time: toTime,
        downtime,
        main_detail: mainDetail,
        sub_detail: subDetail,
        detail_value: parseFloat(detailValue)
      };
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/production`, formData);
      setSubmitMessage(`Data submitted successfully! Date: ${date}, Shift: ${shift}, Downtime: ${downtime}`);
      setDate(''); setShift(''); setParticulars(''); setFromTime(''); setToTime(''); setDowntime(''); setMainDetail(''); setSubDetail(''); setDetailValue('');
      setTimeout(() => setSubmitMessage(''), 5000);
    } catch (err) {
      alert('Error submitting data: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <style>{`
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(-45deg, #fcb900, #9900ef, #ff6900, #00ff07);
            background-size: 400% 400%;
            animation: gradientAnimation 12s ease infinite;
            color: #333;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        h2 {
            color: white;
            text-align: left;
        }
        .emp-input, .emp-textarea, .emp-select {
            width: calc(100% - 100px);
            padding: 10px;
            margin-bottom: 10px;
            border: 2px solid gray;
            border-radius: 10px;
            transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .emp-input:focus, .emp-textarea:focus {
            background-color: #e3f2fd;
            transform: scale(1.05);
            box-shadow: 0 4px 10px rgba(0, 150, 136, 0.3);
        }
        label {
            margin-bottom: 5px;
            display: inline-block;
            text-align: left;
            color: white;
            font-weight: bold;
        }
        .emp-btn {
            font-weight: bold;
            background-color:rgba(218, 216, 224, 0.8) !important;
            color: white;
            border: none;
            font-size: large;
            padding: 10px 19px;
            border-radius: 25px;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.3s;
            margin-bottom: 10px;
        }
        .emp-btn:hover {
            background-color:rgba(218, 216, 224, 0.5) !important;
        }
        .emp-form {
            background-color: rgba(218, 216, 224, 0.6);
            padding: 40px;
            border-radius: 30px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            max-width: 800px;
            width: 100%;
            border: 3px solid white;
        }
        .emp-user-box {
          background-color: white;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 20px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          text-align: center;
        }
        .emp-user-box h3 {
          margin: 0;
          color: #009688;
        }
        .emp-user-box p {
          margin: 5px 0;
          color: #666;
        }
        .emp-top-btns {
          margin-bottom: 20px;
          text-align: center;
        }
        .prod-title {
          color: white !important;
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 20px;
        }
        @media (max-width: 900px) {
          .emp-form {
            max-width: 98vw;
            padding: 20px;
          }
        }
        @media (max-width: 700px) {
          .emp-form {
            max-width: 95vw;
            padding: 10px;
          }
          .emp-input, .emp-textarea, .emp-select {
            width: 90vw;
            font-size: 1rem;
          }
        }
        @media (max-width: 500px) {
          .emp-form {
            max-width: 99vw;
            padding: 5px;
          }
          .emp-input, .emp-textarea, .emp-select {
            width: 85vw;
            font-size: 0.9rem;
          }
          .emp-btn {
            font-size: 1rem;
            padding: 8px 10px;
          }
          .prod-title {
            font-size: 1.5rem;
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
      <div className="emp-top-btns">
        <button 
          onClick={() => navigate('/data-show')}
          className="emp-btn"
        >
          View Production Data
        </button>
      </div>
      {user && (
        <div className="emp-user-box">
          <h3>Welcome, {user.name}!</h3>
          <p>{user.email} - {user.department} - {user.position}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="emp-form">
        <h1 className="prod-title"><u>Production Management</u></h1>
        {submitMessage && (
          <div style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: 10,
            borderRadius: 5,
            marginBottom: 20,
            textAlign: 'center'
          }}>
            {submitMessage}
          </div>
        )}
        <h2>Select a Date:</h2>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="emp-input" /><br /><br />
        <h2>Select Your Shift</h2>
        <label><input type="radio" name="shift" value="Day" checked={shift === 'Day'} onChange={e => setShift(e.target.value)} /> Day</label><br />
        <label><input type="radio" name="shift" value="Night" checked={shift === 'Night'} onChange={e => setShift(e.target.value)} /> Night</label><br />
        <h2>Particulars</h2>
        <textarea value={particulars} onChange={e => setParticulars(e.target.value)} rows={1} className="emp-textarea" /><br /><br />
        <h2>Machine Downtime</h2>
        <label>From:</label><br />
        <input type="time" value={fromTime} onChange={e => setFromTime(e.target.value)} required className="emp-input" /><br /><br />
        <label>To:</label><br />
        <input type="time" value={toTime} onChange={e => setToTime(e.target.value)} required className="emp-input" /><br /><br />
        <label>Downtime (hours and minute):</label>
        <input type="text" value={downtime} readOnly className="emp-input" /><br /><br />
        <h2>Details Hours and Minutes</h2>
        <label>Select By whose Mistake</label>
        <select value={mainDetail} onChange={e => setMainDetail(e.target.value)} required className="emp-select">
          <option value="" disabled>Select Detail</option>
          {mainDetails.map((d, i) => <option key={i} value={d}>{d}</option>)}
        </select><br /><br />
        <label>Select the Problem</label>
        <select value={subDetail} onChange={e => setSubDetail(e.target.value)} required className="emp-select">
          <option value="" disabled>Select Sub-Detail</option>
          {subDetails.map((d, i) => <option key={i} value={d}>{d}</option>)}
        </select><br /><br />
        <label>Enter Value for Downtime:</label>
        <input type="number" value={detailValue} readOnly className="emp-input" /><br /><br />
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
          <button type="submit" className="emp-btn">Submit Data</button>
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="emp-btn"
          >
            Back to Welcome
          </button>
          <button 
            type="button" 
            onClick={() => {
              localStorage.removeItem('user');
              navigate('/employee-login');
            }}
            className="emp-btn"
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeDashboard; 