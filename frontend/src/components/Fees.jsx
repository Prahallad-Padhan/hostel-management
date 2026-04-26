import React, { useState, useEffect } from 'react';
import { feeApi, bookingApi } from '../services';
import '../styles/fees.css';

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [pendingFees, setPendingFees] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    booking_id: '',
    month_year: '',
    amount: '',
    due_date: '',
  });

  useEffect(() => {
    loadFees();
    loadBookings();
  }, []);

  const loadFees = async () => {
    try {
      const response = await feeApi.getAll();
      setFees(response.data);
      const pending = response.data.filter(f => f.status === 'pending');
      setPendingFees(pending);
    } catch (err) {
      alert('Failed to load fees: ' + err.message);
    }
  };

  const loadBookings = async () => {
    try {
      const response = await bookingApi.getAll();
      setBookings(response.data.filter(b => b.status === 'active'));
    } catch (err) {
      alert('Failed to load bookings: ' + err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await feeApi.create(formData);
      alert('Fee created successfully');
      loadFees();
      setShowForm(false);
      setFormData({ booking_id: '', month_year: '', amount: '', due_date: '' });
    } catch (err) {
      alert('Error creating fee: ' + err.message);
    }
  };

  const handlePayment = async (id) => {
    if (window.confirm('Mark fee as paid?')) {
      try {
        await feeApi.markAsPaid(id);
        loadFees();
        alert('Fee marked as paid');
      } catch (err) {
        alert('Error updating fee: ' + err.message);
      }
    }
  };

  const displayFees = filter === 'pending' ? pendingFees : fees;
  const totalPending = pendingFees.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="fees-container">
      <h2>Fee Management</h2>
      <div className="fee-stats">
        <div className="stat">
          <span>Total Pending: ${totalPending.toFixed(2)}</span>
        </div>
      </div>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add New Fee'}
      </button>

      <div className="filter-buttons">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>
          All Fees ({fees.length})
        </button>
        <button onClick={() => setFilter('pending')} className={filter === 'pending' ? 'active' : ''}>
          Pending ({pendingFees.length})
        </button>
      </div>

      {showForm && (
        <form className="fee-form" onSubmit={handleSubmit}>
          <select name="booking_id" value={formData.booking_id} onChange={handleInputChange} required>
            <option value="">Select Student Booking</option>
            {bookings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.student_name} - Room {b.room_number}
              </option>
            ))}
          </select>
          <input type="text" name="month_year" placeholder="Month-Year (e.g., Jan-2024)" value={formData.month_year} onChange={handleInputChange} required />
          <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleInputChange} required />
          <input type="date" name="due_date" value={formData.due_date} onChange={handleInputChange} />
          <button type="submit">Add Fee</button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Month</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Paid Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayFees.map((fee) => (
            <tr key={fee.id}>
              <td>{fee.student_name}</td>
              <td>{fee.month_year}</td>
              <td>${fee.amount}</td>
              <td className={fee.status}>{fee.status}</td>
              <td>{fee.due_date}</td>
              <td>{fee.payment_date || '-'}</td>
              <td>
                {fee.status === 'pending' && (
                  <button onClick={() => handlePayment(fee.id)}>Mark as Paid</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
