const express = require('express');
const { db } = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all rooms
router.get('/', (req, res) => {
  db.all('SELECT * FROM rooms', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get room by ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM rooms WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Room not found' });
    res.json(row);
  });
});

// Create room
router.post('/', authMiddleware, (req, res) => {
  const { room_number, capacity, rent_per_month } = req.body;

  if (!room_number || !capacity || !rent_per_month) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  db.run(
    `INSERT INTO rooms (room_number, capacity, rent_per_month)
     VALUES (?, ?, ?)`,
    [room_number, capacity, rent_per_month],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ id: this.lastID, ...req.body });
    }
  );
});

// Update room
router.put('/:id', authMiddleware, (req, res) => {
  const { room_number, capacity, status, rent_per_month } = req.body;

  db.run(
    `UPDATE rooms SET room_number = ?, capacity = ?, status = ?, rent_per_month = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [room_number, capacity, status, rent_per_month, req.params.id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Room updated successfully' });
    }
  );
});

// Delete room
router.delete('/:id', authMiddleware, (req, res) => {
  db.run('DELETE FROM rooms WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Room deleted successfully' });
  });
});

module.exports = router;
