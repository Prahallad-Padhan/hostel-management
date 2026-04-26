import React, { useState, useEffect } from 'react';
import { studentApi } from '../services';
import '../styles/students.css';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    college_id: '',
    address: '',
    guardian_name: '',
    guardian_phone: '',
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await studentApi.getAll();
      setStudents(response.data);
    } catch (err) {
      alert('Failed to load students: ' + err.message);
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
        await studentApi.update(editingId, formData);
        alert('Student updated successfully');
      } else {
        await studentApi.create(formData);
        alert('Student added successfully');
      }
      loadStudents();
      setShowForm(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        college_id: '',
        address: '',
        guardian_name: '',
        guardian_phone: '',
      });
      setEditingId(null);
    } catch (err) {
      alert('Error saving student: ' + err.message);
    }
  };

  const handleEdit = (student) => {
    setFormData(student);
    setEditingId(student.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await studentApi.delete(id);
        loadStudents();
        alert('Student deleted successfully');
      } catch (err) {
        alert('Error deleting student: ' + err.message);
      }
    }
  };

  return (
    <div className="students-container">
      <h2>Student Management</h2>
      <button onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
        {showForm ? 'Cancel' : 'Add New Student'}
      </button>

      {showForm && (
        <form className="student-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
          <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} required />
          <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleInputChange} />
          <input type="text" name="college_id" placeholder="College ID" value={formData.college_id} onChange={handleInputChange} required />
          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} />
          <input type="text" name="guardian_name" placeholder="Guardian Name" value={formData.guardian_name} onChange={handleInputChange} />
          <input type="tel" name="guardian_phone" placeholder="Guardian Phone" value={formData.guardian_phone} onChange={handleInputChange} />
          <button type="submit">{editingId ? 'Update' : 'Add'} Student</button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>College ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.phone}</td>
              <td>{student.college_id}</td>
              <td>
                <button onClick={() => handleEdit(student)}>Edit</button>
                <button onClick={() => handleDelete(student.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
