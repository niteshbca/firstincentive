import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageDetails = () => {
  const [mainDetails, setMainDetails] = useState([]);
  const [mainDetail, setMainDetail] = useState('');
  const [newMainDetail, setNewMainDetail] = useState('');
  const [subDetails, setSubDetails] = useState([]);
  const [subDetail, setSubDetail] = useState('');
  const [newSubDetail, setNewSubDetail] = useState('');

  useEffect(() => {
    loadMainDetails();
  }, []);

  useEffect(() => {
    if (mainDetail) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/details/sub/${mainDetail}`)
        .then(res => setSubDetails(res.data))
        .catch(() => setSubDetails([]));
    } else {
      setSubDetails([]);
    }
  }, [mainDetail]);

  const loadMainDetails = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/details/main`)
      .then(res => setMainDetails(res.data))
      .catch(() => setMainDetails([]));
  };

  const addMainDetail = async () => {
    if (!newMainDetail) return;
    await axios.post(`${process.env.REACT_APP_API_URL}/api/details/main`, { main_detail: newMainDetail });
    setNewMainDetail('');
    loadMainDetails();
  };
  const editMainDetail = async () => {
    if (!mainDetail || !newMainDetail) return;
    await axios.put(`${process.env.REACT_APP_API_URL}/api/details/main`, { old_main_detail: mainDetail, new_main_detail: newMainDetail });
    setNewMainDetail('');
    loadMainDetails();
  };
  const deleteMainDetail = async () => {
    if (!mainDetail) return;
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/details/main`, { data: { main_detail: mainDetail } });
    setMainDetail('');
    setNewMainDetail('');
    loadMainDetails();
  };

  const addSubDetail = async () => {
    if (!mainDetail || !newSubDetail) return;
    await axios.post(`${process.env.REACT_APP_API_URL}/api/details/sub`, { main_detail: mainDetail, sub_detail: newSubDetail });
    setNewSubDetail('');
    setSubDetail('');
    loadMainDetails();
  };
  const editSubDetail = async () => {
    if (!mainDetail || !subDetail || !newSubDetail) return;
    await axios.put(`${process.env.REACT_APP_API_URL}/api/details/sub`, { main_detail: mainDetail, old_sub_detail: subDetail, new_sub_detail: newSubDetail });
    setNewSubDetail('');
    setSubDetail('');
    loadMainDetails();
  };
  const deleteSubDetail = async () => {
    if (!mainDetail || !subDetail) return;
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/details/sub`, { data: { main_detail: mainDetail, sub_detail: subDetail } });
    setSubDetail('');
    setNewSubDetail('');
    loadMainDetails();
  };

  return (
    <div>
      <style>{`
    * {
      box-sizing: border-box;
    }
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      padding: 20px;
      background: linear-gradient(-45deg, #fcb900, #9900ef, #ff6900, #00ff07);
      background-size: 400% 400%;
      animation: gradientAnimation 12s ease infinite;
      font-family: Arial, sans-serif;
      color: #333;
    }
    h1 {
      text-align: center;
      color: white;
      margin-bottom: 20px;
    }
    label {
      font-weight: bold;
      color: white;
    }
    select, input {
      width: calc(100% - 20px);
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #ccc;
      border-radius: 25px;
      transition: border-color 0.3s, box-shadow 0.3s;
    }
    select:focus, input:focus {
      border-color: #4a90e2;
      box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
      outline: none;
    }
    button {
      background-color:rgba(218, 216, 224, 0.8);
      color: white;
      border: none;
      padding: 10px 15px;
      margin: 10px 5px;
      border-radius: 25px;
      cursor: pointer;
      transition: background-color 0.3s, transform 0.2s;
      font-size: 16px;
    }
    button:hover {
      background-color: rgba(218, 216, 224, 0.6);
      transform: scale(1.05);
    }
    button:active {
      transform: scale(0.95);
    }
    .container {
      max-width: 800px;
      width: 100%;
      padding: 20px;
      background-color: rgba(218, 216, 224, 0.6);
      border-radius: 28px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    }
    @media (max-width: 768px) {
      button {
        width: 100%;
        margin: 5px 0;
      }
      select, input {
        width: 100%;
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
        <h1>Manage Main and Sub Details</h1>
        <label>Select Main Detail:</label>
        <select value={mainDetail} onChange={e => setMainDetail(e.target.value)}>
          <option value="">Select Main Detail</option>
          {mainDetails.map((d, i) => <option key={i} value={d}>{d}</option>)}
        </select>
        <input type="text" placeholder="Enter new main detail" value={newMainDetail} onChange={e => setNewMainDetail(e.target.value)} />
        <div>
          <button onClick={addMainDetail}>Add Main Detail</button>
          <button onClick={editMainDetail}>Edit Main Detail</button>
          <button onClick={deleteMainDetail}>Delete Main Detail</button>
        </div>
        <br />
        <label>Select/Add Sub Detail:</label>
        <select value={subDetail} onChange={e => setSubDetail(e.target.value)}>
          <option value="">Select Sub Detail</option>
          {subDetails.map((d, i) => <option key={i} value={d}>{d}</option>)}
        </select>
        <input type="text" placeholder="Enter new sub-detail" value={newSubDetail} onChange={e => setNewSubDetail(e.target.value)} />
        <div>
          <button onClick={addSubDetail}>Add Sub Detail</button>
          <button onClick={editSubDetail}>Edit Sub Detail</button>
          <button onClick={deleteSubDetail}>Delete Sub Detail</button>
        </div>
      </div>
    </div>
  );
};

export default ManageDetails;
