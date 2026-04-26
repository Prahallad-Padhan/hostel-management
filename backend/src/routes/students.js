const express = require('express');
const { db } = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all students
router.get('/', (req, res) => {
  db.all('SELECT * FROM students', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get student by ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM students WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Student not found' });
    res.json(row);
  });
});

// Create student
router.post('/', authMiddleware, (req, res) => {
  const { name, email, phone, date_of_birth, college_id, address, guardian_name, guardian_phone } = req.body;

  if (!name || !email || !phone || !college_id) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  db.run(
    `INSERT INTO students (name, email, phone, date_of_birth, college_id, address, guardian_name, guardian_phone)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, email, phone, date_of_birth, college_id, address, guardian_name, guardian_phone],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ id: this.lastID, ...req.body });
    }
  );
});

// Update student
router.put('/:id', authMiddleware, (req, res) => {
  const { name, email, phone, date_of_birth, college_id, address, guardian_name, guardian_phone } = req.body;

  db.run(
    `UPDATE students SET name = ?, email = ?, phone = ?, date_of_birth = ?, college_id = ?, address = ?, guardian_name = ?, guardian_phone = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [name, email, phone, date_of_birth, college_id, address, guardian_name, guardian_phone, req.params.id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Student updated successfully' });
    }
  );
});

// Delete student
router.delete('/:id', authMiddleware, (req, res) => {
  db.run('DELETE FROM students WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Student deleted successfully' });
  });
});

module.exports = router;
