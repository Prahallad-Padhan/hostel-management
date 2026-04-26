import React, { useState, useEffect } from 'react';
import { bookingApi, studentApi, roomApi } from '../services';
import '../styles/bookings.css';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    room_id: '',
    check_in_date: '',
  });

  useEffect(() => {
    loadBookings();
    loadStudents();
    loadRooms();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await bookingApi.getAll();
      setBookings(response.data);
    } catch (err) {
      alert('Failed to load bookings: ' + err.message);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await studentApi.getAll();
      setStudents(response.data);
    } catch (err) {
      alert('Failed to load students: ' + err.message);
    }
  };

  const loadRooms = async () => {
    try {
      const response = await roomApi.getAll();
      setRooms(response.data.filter(r => r.current_occupancy < r.capacity));
    } catch (err) {
      alert('Failed to load rooms: ' + err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await bookingApi.create(formData);
      alert('Booking created successfully');
      loadBookings();
      loadRooms();
      setShowForm(false);
      setFormData({ student_id: '', room_id: '', check_in_date: '' });
    } catch (err) {
      alert('Error creating booking: ' + err.message);
    }
  };

  const handleCheckout = async (id) => {
    if (window.confirm('Check out this student?')) {
      try {
        await bookingApi.checkout(id);
        loadBookings();
        loadRooms();
        alert('Student checked out successfully');
      } catch (err) {
        alert('Error checking out: ' + err.message);
      }
    }
  };

  return (
    <div className="bookings-container">
      <h2>Booking Management</h2>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'New Booking'}
      </button>

      {showForm && (
        <form className="booking-form" onSubmit={handleSubmit}>
          <select name="student_id" value={formData.student_id} onChange={handleInputChange} required>
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} - {s.college_id}
              </option>
            ))}
          </select>
          <select name="room_id" value={formData.room_id} onChange={handleInputChange} required>
            <option value="">Select Room</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                Room {r.room_number} (${r.rent_per_month}/month)
              </option>
            ))}
          </select>
          <input type="date" name="check_in_date" value={formData.check_in_date} onChange={handleInputChange} required />
          <button type="submit">Create Booking</button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Room</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.student_name}</td>
              <td>{booking.room_number}</td>
              <td>{booking.check_in_date}</td>
              <td>{booking.check_out_date || 'Active'}</td>
              <td>{booking.status}</td>
              <td>
                {booking.status === 'active' && (
                  <button onClick={() => handleCheckout(booking.id)}>Checkout</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
