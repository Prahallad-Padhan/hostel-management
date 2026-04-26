import React, { useState, useEffect } from 'react';
import { roomApi } from '../services';
import '../styles/rooms.css';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    room_number: '',
    capacity: '',
    rent_per_month: '',
    status: 'available',
  });

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await roomApi.getAll();
      setRooms(response.data);
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
      if (editingId) {
        await roomApi.update(editingId, formData);
        alert('Room updated successfully');
      } else {
        await roomApi.create(formData);
        alert('Room added successfully');
      }
      loadRooms();
      setShowForm(false);
      setFormData({ room_number: '', capacity: '', rent_per_month: '', status: 'available' });
      setEditingId(null);
    } catch (err) {
      alert('Error saving room: ' + err.message);
    }
  };

  const handleEdit = (room) => {
    setFormData(room);
    setEditingId(room.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await roomApi.delete(id);
        loadRooms();
        alert('Room deleted successfully');
      } catch (err) {
        alert('Error deleting room: ' + err.message);
      }
    }
  };

  return (
    <div className="rooms-container">
      <h2>Room Management</h2>
      <button onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
        {showForm ? 'Cancel' : 'Add New Room'}
      </button>

      {showForm && (
        <form className="room-form" onSubmit={handleSubmit}>
          <input type="text" name="room_number" placeholder="Room Number" value={formData.room_number} onChange={handleInputChange} required />
          <input type="number" name="capacity" placeholder="Capacity" value={formData.capacity} onChange={handleInputChange} required />
          <input type="number" name="rent_per_month" placeholder="Rent per Month" value={formData.rent_per_month} onChange={handleInputChange} required />
          <select name="status" value={formData.status} onChange={handleInputChange}>
            <option value="available">Available</option>
            <option value="full">Full</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <button type="submit">{editingId ? 'Update' : 'Add'} Room</button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Room Number</th>
            <th>Capacity</th>
            <th>Current Occupancy</th>
            <th>Rent/Month</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.room_number}</td>
              <td>{room.capacity}</td>
              <td>{room.current_occupancy}</td>
              <td>${room.rent_per_month}</td>
              <td>{room.status}</td>
              <td>
                <button onClick={() => handleEdit(room)}>Edit</button>
                <button onClick={() => handleDelete(room.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
