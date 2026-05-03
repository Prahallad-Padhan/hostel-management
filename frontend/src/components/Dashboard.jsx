import React, { useState, useEffect } from 'react';
import { feeApi, bookingApi } from '../services';
import '../styles/dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    pendingFees: 0,
    totalFeesDue: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const bookingResponse = await bookingApi.getAll();
      const feeResponse = await feeApi.getAll();

      const activeBookings = bookingResponse.data.filter(b => b.status === 'active');
      const pendingFees = feeResponse.data.filter(f => f.status === 'pending');
      const totalDue = pendingFees.reduce((sum, f) => sum + f.amount, 0);

      setStats({
        totalStudents: activeBookings.length,
        occupiedRooms: activeBookings.length,
        totalRooms: activeBookings.length,
        pendingFees: pendingFees.length,
        totalFeesDue: totalDue,
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Students</h3>
          <p className="number">{stats.totalStudents}</p>
        </div>
        <div className="stat-card">
          <h3>Occupied Rooms</h3>
          <p className="number">{stats.occupiedRooms}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Fees</h3>
          <p className="number">{stats.pendingFees}</p>
        </div>
        <div className="stat-card">
          <h3>Total Due</h3>
          <p className="number">${stats.totalFeesDue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
