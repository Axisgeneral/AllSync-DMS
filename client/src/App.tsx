import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Customers from './pages/Customers';
import Sales from './pages/Sales';
import Service from './pages/Service';
import Reports from './pages/Reports';
import Leads from './pages/Leads';
import Deals from './pages/Deals';
import Trades from './pages/Trades';
import CreditApplications from './pages/CreditApplications';
import LenderManagement from './pages/LenderManagement';
import DealManagement from './pages/DealManagement';
import ServiceOrders from './pages/ServiceOrders';
import PartsManagement from './pages/PartsManagement';
import GLMapping from './pages/GLMapping';
import Reconciliation from './pages/Reconciliation';
import ProfitLoss from './pages/ProfitLoss';
import TimeClock from './pages/TimeClock';
import Payroll from './pages/Payroll';
import Scheduling from './pages/Scheduling';
import EmployeeData from './pages/EmployeeData';
import UserManagement from './pages/UserManagement';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (token: string, userData: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Road to Sale */}
        <Route path="/leads" element={<Leads />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/trades" element={<Trades />} />
        
        {/* Inventory Management */}
        <Route path="/vehicles" element={<Vehicles />} />
        
        {/* F&I */}
        <Route path="/credit-applications" element={<CreditApplications />} />
        <Route path="/lender-management" element={<LenderManagement />} />
        <Route path="/deal-management" element={<DealManagement />} />
        
        {/* Service Department */}
        <Route path="/service-orders" element={<ServiceOrders />} />
        <Route path="/parts-management" element={<PartsManagement />} />
        
        {/* Accounting */}
        <Route path="/gl-mapping" element={<GLMapping />} />
        <Route path="/reconciliation" element={<Reconciliation />} />
        <Route path="/profit-loss" element={<ProfitLoss />} />
        
        {/* Human Resources */}
        <Route path="/time-clock" element={<TimeClock />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/scheduling" element={<Scheduling />} />
        <Route path="/employee-data" element={<EmployeeData />} />
        <Route path="/user-management" element={<UserManagement />} />
        
        {/* Legacy routes */}
        <Route path="/sales" element={<Sales />} />
        <Route path="/service" element={<Service />} />
        <Route path="/reports" element={<Reports />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
