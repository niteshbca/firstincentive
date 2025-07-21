import React, { useEffect, useState, useRef } from 'react';
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

// Helper to get month from date string (YYYY-MM-DD)
function getMonthFromDate(dateStr) {
  if (!dateStr) return '';
  const monthNum = parseInt(dateStr.split('-')[1], 10);
  if (isNaN(monthNum)) return '';
  return monthNum;
}
const monthNames = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Helper to convert MM/DD/YYYY to YYYY-MM-DD
function mmddyyyyToYyyyMmDd(dateStr) {
  if (!dateStr) return '';
  const [mm, dd, yyyy] = dateStr.split('/');
  if (!mm || !dd || !yyyy) return '';
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}
// Helper to get latest multiplier for a date
function getLatestMultiplierForDate(date, calcHistory) {
  // Find the last (most recent) record in calcHistory with matching date
  for (let i = calcHistory.length - 1; i >= 0; i--) {
    if (mmddyyyyToYyyyMmDd(calcHistory[i].date) === date) {
      return calcHistory[i].multiplier;
    }
  }
  return '';
}

const DataShow = () => {
  const [data, setData] = useState([]);
  const [mainDetails, setMainDetails] = useState([]);
  const [mainDetail, setMainDetail] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [shiftFilter, setShiftFilter] = useState('');
  const [subDetails, setSubDetails] = useState([]);
  const [subDetail, setSubDetail] = useState('');
  const [sum, setSum] = useState(0);
  const [multiplier, setMultiplier] = useState(160.2571);
  const [remainingProduction, setRemainingProduction] = useState(null);
  const [monthFilter, setMonthFilter] = useState('');
  const [calcHistory, setCalcHistory] = useState([]); // [{date, time, multiplier}]
  const [selectedHistoryIdx, setSelectedHistoryIdx] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [latestCalc, setLatestCalc] = useState(null); // {date, time, multiplier}
  const multiplierRef = useRef();
  const navigate = useNavigate();

  // Fetch calculation history from backend
  const fetchCalcHistory = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/calculation-history`);
      setCalcHistory(res.data);
      if (res.data.length > 0) setLatestCalc(res.data[res.data.length - 1]);
      else setLatestCalc(null);
    } catch (err) {
      setCalcHistory([]);
      setLatestCalc(null);
    }
  };

  useEffect(() => {
    fetchData();
    fetchMainDetails();
    fetchSum();
    fetchCalcHistory();
  }, []);

  // Live clock effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
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

  const fetchSum = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/production/sum/by-employee`);
      setSum(res.data.totalSum);
      setRemainingProduction(res.data.remainingProduction);
    } catch (err) {
      setSum(0);
      setRemainingProduction(null);
    }
  };

  const filteredData = data.filter(row =>
    (!mainDetail || row.main_detail === mainDetail) &&
    (!dateFilter || row.dates === dateFilter) &&
    (!shiftFilter || row.shift === shiftFilter) &&
    (!subDetail || row.sub_detail === subDetail) &&
    (!monthFilter || getMonthFromDate(row.dates) === parseInt(monthFilter, 10))
  );

  // Calculate sum for filtered data
  const filteredSum = filteredData.reduce((acc, row) => acc + (Number(row.detail_value) || 0), 0);

  const uniqueDates = [...new Set(data.map(row => row.dates))];

  const handleExcelExport = () => {
    navigate('/excel-data');
  };

  const handleCalculate = async () => {
    const password = window.prompt('Enter password to calculate:');
    if (password === '123') {
      setRemainingProduction(sum * multiplier);
      // Record calculation to backend
      const now = new Date();
      const record = {
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
        multiplier: Number(multiplier)
      };
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/calculation-history`, record);
        fetchCalcHistory();
      } catch (err) {
        alert('Failed to save calculation history!');
      }
    } else {
      alert('Incorrect password. Value not changed.');
    }
  };

  // When a history is selected, update multiplier
  useEffect(() => {
    if (selectedHistoryIdx !== '') {
      const idx = parseInt(selectedHistoryIdx, 10);
      if (!isNaN(idx) && calcHistory[idx]) {
        setMultiplier(calcHistory[idx].multiplier);
      }
    }
    // eslint-disable-next-line
  }, [selectedHistoryIdx, calcHistory]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
      {/* Main Content */}
      <div style={{ flex: 1 }}>
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
              min-height: 100vh;
          }
          @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            25% { background-position: 50% 100%; }
            50% { background-position: 100% 50%; }
            75% { background-position: 50% 0%; }
            100% { background-position: 0% 50%; }
          }
          .ds-table-container {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px 0;
          }
          table {
            width: 100vw;
            max-width: 100vw;
            border-collapse: collapse;
            background-color: rgba(218, 216, 224, 0.6);
            border-radius: 10px;
            overflow: hidden;
            color: white;
            font-size: 1.2rem;
            margin: 0 auto;
          }
          th {
            background-color: rgba(218, 216, 224, 0.6);
            color: white;
            padding: 18px;
            font-size: 1.2rem;
            font-weight: bold;
          }
          td {
            padding: 18px;
            border: 1px solid #ddd;
            text-align: center;
            font-size: 1.1rem;
          }
          .ds-btn {
            font-weight: bold;
            background-color: rgba(218, 216, 224, 0.6);
            color: white;
            border: none;
            font-size: 1rem;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            margin: 10px 5px 10px 0;
            transition: background-color 0.3s, transform 0.3s;
          }
          .ds-btn:hover {
            background-color: #b2dfdb;
            color: #333;
          }
          .ds-target-value, .ds-remaining-production {
            color: white;
            border-radius: 30px;
            background-color: rgba(218, 216, 224, 0.6);
            text-align: center;
            padding: 10px;
            margin: 20px auto;
            font-size: 28px;
            width: 50%;
            animation: fadeIn 2s;
          }
          .ds-calc-form {
            text-align: center;
            margin-top: 20px;
          }
          .ds-calc-label {
            font-size: 20px;
            color: white;
          }
          .ds-calc-input {
            padding: 10px;
            font-size: 16px;
            width: 100px;
            margin: 0 10px;
            border-radius: 25px;
            color: white;
            background-color: rgba(218, 216, 224, 0.6);
            border: solid white 2px;
          }
          .ds-filter-group {
            display: flex;
            gap: 10px;
            margin: 20px 0;
            flex-wrap: wrap;
            justify-content: center;
          }
          .ds-filter {
            margin: 0 5px;
            padding: 10px;
            font-size: 1.1rem;
            border-radius: 25px;
            border: 2px solid #009688;
            background-color: rgba(218,216,224,0.6) !important;
            color: #333 !important;
            min-width: 120px;
            transition: background-color 0.3s;
            text-align: center;
          }
          .ds-filter:hover {
            background-color: #f5f5f5;
          }
          #detailValueSum {
            color: white;
            text-align: center;
            font-size: 26px;
            margin-top: 20px;
            font-weight: bold;
            background: rgba(218, 216, 224, 0.6);
            border-radius: 20px;
            padding: 10px 0;
            width: 60%;
            margin-left: auto;
            margin-right: auto;
          }
          @media (max-width: 1200px) {
            table {
              max-width: 98vw;
              font-size: 1rem;
            }
          }
          @media (max-width: 900px) {
            table, th, td {
              font-size: 0.95rem;
            }
            .ds-target-value, .ds-remaining-production, #detailValueSum {
              font-size: 22px;
              width: 90%;
            }
          }
          @media (max-width: 600px) {
            .ds-table-container {
              padding: 5px 0;
            }
            table, th, td {
              font-size: 0.85rem;
            }
            th, td {
              padding: 6px;
            }
            .ds-target-value, .ds-remaining-production, #detailValueSum {
              font-size: 18px;
              width: 99%;
            }
          }
          @media (max-width: 480px) {
            .ds-table-container {
              padding: 2px 0;
            }
            table, th, td {
              font-size: 0.7rem;
            }
            th, td {
              padding: 3px;
            }
            .ds-target-value, .ds-remaining-production, #detailValueSum {
              font-size: 14px;
              width: 100%;
            }
          }
        `}</style>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <button onClick={() => window.location.href = '/'} className="ds-btn">Log Out</button>
          <button onClick={handleExcelExport} className="ds-btn">Excel Format</button>
          <button onClick={fetchData} className="ds-btn">Refresh Data</button>
        </div>
        <p className="ds-target-value">Original Target Value: 91,667.0612</p>
        <form onSubmit={e => { e.preventDefault(); handleCalculate(); }} className="ds-calc-form" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <label className="ds-calc-label">Enter Multiplier:</label>
          <input type="number" step="0.01" value={multiplier} onChange={e => setMultiplier(e.target.value)} required className="ds-calc-input" ref={multiplierRef} />
          <button type="submit" className="ds-btn">Calculate</button>
        </form>
        {/* Previous Calculations Table */}
        {calcHistory.length > 0 && (
          <div style={{ margin: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginBottom: 8 }}>Previous Calculations</div>
            <table style={{ width: 'auto', minWidth: 400, background: 'rgba(218,216,224,0.6)', color: '#333', borderRadius: 10, overflow: 'hidden', marginBottom: 0 }}>
              <thead>
                <tr>
                  <th style={{ padding: 10 }}>Date</th>
                  <th style={{ padding: 10 }}>Multiplier</th>
                  <th style={{ padding: 10 }}>Time</th>
                </tr>
              </thead>
            </table>
            <div style={{ maxHeight: 90, overflowY: 'auto', minWidth: 400, width: 'auto' }}>
              <table style={{ width: '100%', background: 'rgba(218,216,224,0.6)', color: '#333' }}>
                <tbody>
                  {calcHistory.slice().reverse().map((rec, idx) => (
                    <tr key={idx} style={{ cursor: 'pointer', background: multiplier == rec.multiplier ? '#b2dfdb' : 'inherit' }}
                      onClick={() => setMultiplier(rec.multiplier)}>
                      <td style={{ padding: 10 }}>{rec.date}</td>
                      <td style={{ padding: 10 }}>{rec.multiplier}</td>
                      <td style={{ padding: 10 }}>{rec.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {remainingProduction !== null && (
          <p className="ds-remaining-production">Remaining Production To Reach Target Value: {Number(91667.0612 - remainingProduction).toFixed(2)}</p>
        )}
        <div className="ds-filter-group" style={{ justifyContent: 'center', display: 'flex' }}>
          <select value={mainDetail} onChange={e => setMainDetail(e.target.value)} className="ds-filter">
            <option value="">Select Main Details</option>
            {mainDetails.map((d, i) => <option key={i} value={d}>{d}</option>)}
          </select>
          {mainDetail && (
            <>
              <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="ds-filter">
                <option value="">Show all Dates</option>
                {uniqueDates.map((d, i) => <option key={i} value={d}>{d}</option>)}
              </select>
              <select value={shiftFilter} onChange={e => setShiftFilter(e.target.value)} className="ds-filter">
                <option value="">Day and Night</option>
                <option value="Day">Day</option>
                <option value="Night">Night</option>
              </select>
              <select value={subDetail} onChange={e => setSubDetail(e.target.value)} className="ds-filter">
                <option value="">Select Sub Detail</option>
                {subDetails.map((d, i) => <option key={i} value={d}>{d}</option>)}
              </select>
              <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)} className="ds-filter">
                <option value="">All Months</option>
                {monthNames.slice(1).map((name, idx) => (
                  <option key={name} value={idx + 1}>{name}</option>
                ))}
              </select>
            </>
          )}
        </div>
        <p id="detailValueSum" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
          Total Sum of Detail Value{mainDetail ? ` for '${mainDetail}'` : ''}{monthFilter ? ` in ${monthNames[monthFilter]}` : ''}: {Number(filteredSum).toFixed(2)}
        </p>
        <div className="ds-table-container" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', width: '100vw', maxWidth: '100vw' }}>
          <div style={{ width: '100vw', maxWidth: '100vw', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
            <table style={{ margin: '0 auto', width: '100vw', maxWidth: '100vw' }}>
              <thead>
                <tr>
                  <th>Serial No.</th>
                  <th>Multiplier</th>
                  <th>Date</th>
                  <th>Shift</th>
                  <th>Particulars</th>
                  <th>From Time</th>
                  <th>To Time</th>
                  <th>Downtime</th>
                  <th>Main Detail</th>
                  <th>Sub Detail</th>
                  <th>Detail Value</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? filteredData.map((row, idx) => (
                  <tr key={row._id || idx}>
                    <td>{idx + 1}</td>
                    <td>{getLatestMultiplierForDate(row.dates, calcHistory)}</td>
                    <td>{row.dates}</td>
                    <td>{row.shift}</td>
                    <td>{row.particulars}</td>
                    <td>{formatTime12Hour(row.from_time)}</td>
                    <td>{formatTime12Hour(row.to_time)}</td>
                    <td>{row.downtime}</td>
                    <td>{row.main_detail}</td>
                    <td>{row.sub_detail}</td>
                    <td>{row.detail_value}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={11} style={{ padding: 20, color: '#777' }}>No data found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataShow; 