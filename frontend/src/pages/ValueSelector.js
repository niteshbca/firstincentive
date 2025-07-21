import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ValueSelector = () => {
  const [mainDetails, setMainDetails] = useState([]);
  const [mainDetail, setMainDetail] = useState('');
  const [subDetails, setSubDetails] = useState([]);

  useEffect(() => {
    fetchMainDetails();
  }, []);

  useEffect(() => {
    if (mainDetail) {
      fetchSubDetails();
    } else {
      setSubDetails([]);
    }
  }, [mainDetail]);

  const fetchMainDetails = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/details/main`);
      setMainDetails(res.data);
    } catch (err) {
      setMainDetails([]);
    }
  };

  const fetchSubDetails = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/details/sub/${mainDetail}`);
      setSubDetails(res.data);
    } catch (err) {
      setSubDetails([]);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 20 }}>
      <div style={{ maxWidth: 400, margin: 'auto' }}>
        <h1>Select Details</h1>
        <label htmlFor="main-detail" style={{ display: 'block', margin: '10px 0 5px' }}>Select Main Detail:</label>
        <select
          id="main-detail"
          value={mainDetail}
          onChange={e => setMainDetail(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 20 }}
        >
          <option value="">--Select--</option>
          {mainDetails.map((detail, i) => (
            <option key={i} value={detail}>{detail}</option>
          ))}
        </select>

        <label htmlFor="sub-detail" style={{ display: 'block', margin: '10px 0 5px' }}>Select Sub Detail:</label>
        <select
          id="sub-detail"
          disabled={!mainDetail}
          style={{ width: '100%', padding: 8, marginBottom: 20 }}
        >
          <option value="">--Select--</option>
          {subDetails.map((detail, i) => (
            <option key={i} value={detail}>{detail}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ValueSelector; 