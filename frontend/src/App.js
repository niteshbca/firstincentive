import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeLogin from './pages/EmployeeLogin';
import AddEmployee from './pages/AddEmployee';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManageDetails from './pages/ManageDetails';
import DisplayData from './pages/DisplayData';
import DataShow from './pages/DataShow';

import DefaultPage from './pages/DefaultPage';

import ExcelData from './pages/ExcelData';

import PagalDropdown from './pages/PagalDropdown';
import ValueSelector from './pages/ValueSelector';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/manage-details" element={<ManageDetails />} />
        <Route path="/display-data" element={<DisplayData />} />
        <Route path="/data-show" element={<DataShow />} />
       
        <Route path="/default" element={<DefaultPage />} />
        
        <Route path="/excel-data" element={<ExcelData />} />
        
        <Route path="/pagal-dropdown" element={<PagalDropdown />} />
        <Route path="/value-selector" element={<ValueSelector />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        {/* Add more routes here for dashboard, add employee, etc. */}
      </Routes>
    </Router>
  );
}

export default App;
