import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SUB_DETAIL_COLUMNS = [
  'Generator Failure',
  'Plant Heating',
  'Plant Shut Down',
  'Power OFF',
  'Material Burning in Die',
  'Break Down',
  'Material Burning In Screw Barrel',
  'Break Down', // second instance, keep for compatibility
  'Production Department',
  'Raw Material Shortage',
];

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

const ExcelData = () => {
  const [data, setData] = useState([]);
  const [subDetailSums, setSubDetailSums] = useState({});
  const [totalSum, setTotalSum] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/production`);
      const productionData = res.data;
      // Calculate sums for each sub detail
      const sums = {};
      let total = 0;
      SUB_DETAIL_COLUMNS.forEach(col => sums[col] = 0);
      productionData.forEach(row => {
        SUB_DETAIL_COLUMNS.forEach(col => {
          if (row.sub_detail === col) {
            sums[col] += parseFloat(row.detail_value) || 0;
            total += parseFloat(row.detail_value) || 0;
          }
        });
      });
      setSubDetailSums(sums);
      setTotalSum(total);
      setData(productionData);
    } catch (err) {
      setData([]);
    }
  };

  const getDetailValue = (row, subDetail) => {
    return row.sub_detail === subDetail ? parseFloat(row.detail_value) || 0 : 0;
  };

  const PERCENTAGE_DENOMINATOR = 572;

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
        .excel-container {
          width: 100%;
          overflow: hidden;
        }
        .excel-table-wrapper {
          width: 100%;
          max-width: 100vw;
          overflow-x: auto;
        }
        table {
          width: 100%;
          min-width: 1200px;
          border-collapse: collapse;
          background-color: rgba(218, 216, 224, 0.6);
          border-radius: 10px;
          color: white;
          font-size: 1.1rem;
        }
        th {
          background-color: rgba(218, 216, 224, 0.6);
          color: white;
          padding: 12px;
          font-size: 1.1rem;
          font-weight: bold;
          border: 4px solid white;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        td {
          padding: 10px;
          border: 4px solid white;
          text-align: center;
          font-size: 1rem;
        }
        .excel-btn {
          font-weight: bold;
          background-color: rgba(218, 216, 224, 0.6);
          color: white;
          border: none;
          font-size: 1rem;
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          margin: 30px auto 0;
          display: block;
          transition: background-color 0.3s, transform 0.3s;
        }
        .excel-btn:hover {
          background-color: #b2dfdb;
          color: #333;
        }
        .excel-target-value {
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
        .total-row, .percentage-row {
          background-color: rgba(218, 216, 224, 0.6);
        }
        @media (max-width: 1200px) {
          table {
            min-width: 900px;
            font-size: 1rem;
          }
        }
        @media (max-width: 900px) {
          table {
            min-width: 700px;
            font-size: 0.95rem;
          }
          .excel-target-value {
            font-size: 22px;
            width: 90%;
          }
        }
        @media (max-width: 600px) {
          table {
            min-width: 500px;
            font-size: 0.85rem;
          }
          th, td {
            padding: 6px;
          }
          .excel-target-value {
            font-size: 18px;
            width: 99%;
          }
        }
        @media (max-width: 480px) {
          table {
            min-width: 350px;
            font-size: 0.7rem;
          }
          th, td {
            padding: 3px;
          }
          .excel-target-value {
            font-size: 14px;
            width: 100%;
          }
        }
      `}</style>
      <div className="excel-container">
        <button onClick={() => window.location.href = '/'} className="excel-btn">Log Out</button>
        <p className="excel-target-value">Original Target Value: 91,667.0612</p>
        <div className="excel-table-wrapper">
          <table>
            <thead>
              <tr>
                <th colSpan={8}></th>
                <th colSpan={7} style={{ textAlign: 'center' }}>By Other</th>
                <th style={{ textAlign: 'center' }}>By Employee</th>
                <th colSpan={2} style={{ textAlign: 'center' }}>By Company</th>
              </tr>
              <tr>
                <th>Serial No.</th>
                <th>Date</th>
                <th>Shift</th>
                <th>Particulars</th>
                <th>From Time</th>
                <th>To Time</th>
                <th>Downtime</th>
                <th>Main Detail</th>
                <th>Generator Failure</th>
                <th>Plant Heating</th>
                <th>Plant Shut Down</th>
                <th>Power OFF</th>
                <th>Material Burning in Die</th>
                <th>Break Down</th>
                <th>Material Burning In Screw Barrel</th>
                <th>Production Department</th>
                <th>Raw Material Shortage</th>
                <th>Break Down</th>
              </tr>
              <tr className="total-row">
                <td colSpan={8} style={{ textAlign: 'right', fontWeight: 'bold' }}>Total:</td>
                {SUB_DETAIL_COLUMNS.map((subDetail, i) => (
                  <td key={i}><strong>{subDetailSums[subDetail]?.toFixed(2) || '0.00'}</strong></td>
                ))}
              </tr>
              <tr className="percentage-row">
                <td colSpan={8} style={{ textAlign: 'right', fontWeight: 'bold' }}>Percentage:</td>
                {SUB_DETAIL_COLUMNS.map((subDetail, i) => {
                  const percentage = ((subDetailSums[subDetail] || 0) / PERCENTAGE_DENOMINATOR) * 100;
                  return <td key={i}><strong>{percentage.toFixed(2)}%</strong></td>;
                })}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={row._id || index} style={{ background: 'rgba(255,255,255,0.10)' }}>
                  <td>{index + 1}</td>
                  <td>{row.dates}</td>
                  <td>{row.shift}</td>
                  <td>{row.particulars}</td>
                  <td>{formatTime12Hour(row.from_time)}</td>
                  <td>{formatTime12Hour(row.to_time)}</td>
                  <td>{row.downtime}</td>
                  <td>{row.main_detail}</td>
                  {SUB_DETAIL_COLUMNS.map((subDetail, i) => (
                    <td key={i}>{getDetailValue(row, subDetail) ? getDetailValue(row, subDetail).toFixed(2) : 0}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExcelData; 