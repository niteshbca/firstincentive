import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Helper to format time to 12-hour with AM/PM
function formatTime12Hour(timeStr) {
  if (!timeStr) return '';
  const [hour, minute] = timeStr.split(':');
  let h = parseInt(hour, 10);
  const m = minute || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

const DisplayData = () => {
  const [data, setData] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [mainDetails, setMainDetails] = useState([]);
  const [subDetails, setSubDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchMainDetails();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/production`);
      setData(res.data);
    } catch (err) {
      setData([]);
    }
  };

  const fetchMainDetails = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/details/main`);
      setMainDetails(res.data);
    } catch (err) {
      setMainDetails([]);
    }
  };

  const fetchSubDetails = async (mainDetail) => {
    if (mainDetail) {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/details/sub/${mainDetail}`);
        setSubDetails(res.data);
      } catch (err) {
        setSubDetails([]);
      }
    } else {
      setSubDetails([]);
    }
  };

  const handleEdit = (row) => {
    setEditingRow(row._id);
    setEditForm({
      dates: row.dates,
      shift: row.shift,
      particulars: row.particulars,
      from_time: row.from_time,
      to_time: row.to_time,
      downtime: row.downtime,
      main_detail: row.main_detail,
      sub_detail: row.sub_detail,
      detail_value: row.detail_value
    });
    fetchSubDetails(row.main_detail);
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditForm({});
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/production/${encodeURIComponent(editForm.dates)}`, editForm);
      setEditingRow(null);
      setEditForm({});
      fetchData();
      alert('Data updated successfully!');
    } catch (err) {
      alert('Error updating data: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (dates) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/production/${encodeURIComponent(dates)}`);
      fetchData();
    } catch (err) {
      alert('Error deleting record');
    }
  };

  const calculateDowntime = (fromTime, toTime) => {
    if (fromTime && toTime) {
      const from = new Date(`1970-01-01T${fromTime}`);
      let to = new Date(`1970-01-01T${toTime}`);
      if (to < from) to.setDate(to.getDate() + 1);
      const diffMs = to - from;
      const diffHours = diffMs / (1000 * 60 * 60);
      const hours = Math.floor(diffHours);
      const minutes = Math.floor((diffHours - hours) * 60);
      return `${hours}h ${minutes}m`;
    }
    return '';
  };

  const handleTimeChange = (field, value) => {
    const newForm = { ...editForm, [field]: value };
    if (field === 'from_time' || field === 'to_time') {
      const downtime = calculateDowntime(
        field === 'from_time' ? value : newForm.from_time,
        field === 'to_time' ? value : newForm.to_time
      );
      newForm.downtime = downtime;
      if (newForm.from_time && newForm.to_time) {
        const from = new Date(`1970-01-01T${newForm.from_time}`);
        let to = new Date(`1970-01-01T${newForm.to_time}`);
        if (to < from) to.setDate(to.getDate() + 1);
        const diffMs = to - from;
        const diffHours = diffMs / (1000 * 60 * 60);
        newForm.detail_value = parseFloat(diffHours.toFixed(2));
      }
    }
    setEditForm(newForm);
  };

  const handleMainDetailChange = (value) => {
    setEditForm({ ...editForm, main_detail: value, sub_detail: '' });
    fetchSubDetails(value);
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
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          25% { background-position: 50% 100%; }
          50% { background-position: 100% 50%; }
          75% { background-position: 50% 0%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .data-table-container {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          padding: 40px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background-color: rgba(218, 216, 224, 0.6);
          border-radius: 10px;
          overflow: hidden;
          color: white;
          animation: fadeIn 0.5s ease-in;
          border: 2px solid white;
          font-size: 1.25rem;
        }
        th {
          background-color: rgba(218, 216, 224, 0.6);
          color: white;
          padding: 18px;
          font-size: 1.3rem;
          font-weight: bold;
          border: 1px solid white;
        }
        td {
          padding: 18px;
          border: 1px solid white;
          text-align: center;
          font-size: 1.15rem;
          color: #333;
          background: rgba(255,255,255,0.7);
        }
        .edit-btn, .delete-btn, .save-btn, .cancel-btn, .refresh-btn {
          border: none;
          cursor: pointer;
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 1.1rem;
          margin: 0 4px;
          background: #e0e0e0;
          color: #333;
          transition: background 0.2s, color 0.2s, transform 0.2s;
        }
        .edit-btn:hover, .delete-btn:hover, .save-btn:hover, .cancel-btn:hover, .refresh-btn:hover {
          background: #bdbdbd;
          color: #111;
          transform: scale(1.05);
        }
        .edit-btn, .delete-btn {
          text-decoration: underline;
        }
        @media (max-width: 1200px) {
          .data-table-container {
            max-width: 99vw;
            padding: 10px;
          }
          table, th, td {
            font-size: 1rem;
          }
        }
        @media (max-width: 900px) {
          .data-table-container {
            padding: 5px;
          }
          table, th, td {
            font-size: 0.95rem;
          }
        }
        @media (max-width: 600px) {
          .data-table-container {
            padding: 2px;
          }
          table, th, td {
            font-size: 0.85rem;
          }
          th, td {
            padding: 6px;
          }
        }
        @media (max-width: 480px) {
          .data-table-container {
            padding: 0;
          }
          table, th, td {
            font-size: 0.7rem;
          }
          th, td {
            padding: 3px;
          }
        }
      `}</style>
      <h1 style={{ color: 'white', textAlign: 'center' }}>Data Edit Or Delete</h1>
      <button 
        onClick={fetchData} 
        className="refresh-btn"
      >
        Refresh Data
      </button>
      <div className="data-table-container" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Shift</th>
              <th>Particulars</th>
              <th>From Time</th>
              <th>To Time</th>
              <th>Downtime</th>
              <th>Main Detail</th>
              <th>Sub Detail</th>
              <th>Detail Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? data.map((row, idx) => (
              <React.Fragment key={row._id || idx}>
                {editingRow === row._id ? (
                  <tr style={{ backgroundColor: '#f0f8ff', borderBottom: '2px solid #4CAF50' }}>
                    <td>
                      <input
                        type="date"
                        value={editForm.dates}
                        onChange={(e) => setEditForm({...editForm, dates: e.target.value})}
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ddd' }}
                      />
                    </td>
                    <td>
                      <select
                        value={editForm.shift}
                        onChange={(e) => setEditForm({...editForm, shift: e.target.value})}
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ddd' }}
                      >
                        <option value="">Select Shift</option>
                        <option value="Day">Day</option>
                        <option value="Night">Night</option>
                      </select>
                    </td>
                    <td>
                      <textarea
                        value={editForm.particulars}
                        onChange={(e) => setEditForm({...editForm, particulars: e.target.value})}
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ddd', resize: 'vertical' }}
                        rows={2}
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        value={editForm.from_time}
                        onChange={(e) => handleTimeChange('from_time', e.target.value)}
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ddd' }}
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        value={editForm.to_time}
                        onChange={(e) => handleTimeChange('to_time', e.target.value)}
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ddd' }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editForm.downtime}
                        readOnly
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ddd', backgroundColor: '#f5f5f5' }}
                      />
                    </td>
                    <td>
                      <select
                        value={editForm.main_detail}
                        onChange={(e) => handleMainDetailChange(e.target.value)}
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ddd' }}
                      >
                        <option value="">Select Main Detail</option>
                        {mainDetails.map((detail, i) => (
                          <option key={i} value={detail}>{detail}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={editForm.sub_detail}
                        onChange={(e) => setEditForm({...editForm, sub_detail: e.target.value})}
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ddd' }}
                      >
                        <option value="">Select Sub Detail</option>
                        {subDetails.map((detail, i) => (
                          <option key={i} value={detail}>{detail}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={editForm.detail_value}
                        readOnly
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ddd', backgroundColor: '#f5f5f5' }}
                      />
                    </td>
                    <td>
                      <button className="save-btn" onClick={handleUpdate}>Save</button>
                      <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td>{row.dates}</td>
                    <td>{row.shift}</td>
                    <td>{row.particulars}</td>
                    <td>{formatTime12Hour(row.from_time)}</td>
                    <td>{formatTime12Hour(row.to_time)}</td>
                    <td>{row.downtime}</td>
                    <td>{row.main_detail}</td>
                    <td>{row.sub_detail}</td>
                    <td>{row.detail_value}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(row)}>Edit</button> |
                      <button className="delete-btn" onClick={() => handleDelete(row.dates)}>Delete</button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )) : (
              <tr><td colSpan={10} style={{ padding: 20, color: '#777' }}>No records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplayData; 