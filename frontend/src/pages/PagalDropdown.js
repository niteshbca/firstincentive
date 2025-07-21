import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PagalDropdown = () => {
  const [mainDetails, setMainDetails] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState('');

  useEffect(() => {
    fetchMainDetails();
  }, []);

  const fetchMainDetails = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/details/main`);
      setMainDetails(res.data);
    } catch (err) {
      setMainDetails([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDetail) {
      alert(`Selected: ${selectedDetail}`);
      // You can add more logic here for form submission
    } else {
      alert('Please select a main detail');
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Dynamic Dropdown from Database</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="filter" style={{ display: 'block', margin: '10px 0 5px' }}>Select Main Detail:</label>
        <select
          id="filter"
          value={selectedDetail}
          onChange={e => setSelectedDetail(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 20, maxWidth: 400 }}
        >
          <option value="">Select Main Detail</option>
          {mainDetails.map((detail, i) => (
            <option key={i} value={detail}>{detail}</option>
          ))}
        </select>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#017c77', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default PagalDropdown; 