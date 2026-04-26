import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Rooms from './components/Rooms';
import Bookings from './components/Bookings';
import Fees from './components/Fees';
import './App.css';

function App() {
  const [user, setUser] = useState(localStorage.getItem('token') ? { loggedIn: true } : null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={() => setUser({ loggedIn: true })} />;
  }

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">Hostel Management System</div>
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/students">Students</Link>
            <Link to="/rooms">Rooms</Link>
            <Link to="/bookings">Bookings</Link>
            <Link to="/fees">Fees</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </nav>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/fees" element={<Fees />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
