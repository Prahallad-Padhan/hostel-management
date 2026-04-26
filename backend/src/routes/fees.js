const express = require('express');
const { db } = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all fees
router.get('/', (req, res) => {
  db.all(
    `SELECT f.*, s.name as student_name, r.room_number
     FROM fees f
     JOIN bookings b ON f.booking_id = b.id
     JOIN students s ON b.student_id = s.id
     JOIN rooms r ON b.room_id = r.id`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Get fees by booking ID
router.get('/booking/:booking_id', (req, res) => {
  db.all(
    `SELECT * FROM fees WHERE booking_id = ?`,
    [req.params.booking_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Create fee
router.post('/', authMiddleware, (req, res) => {
  const { booking_id, month_year, amount, due_date } = req.body;

  if (!booking_id || !month_year || !amount) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  db.run(
    `INSERT INTO fees (booking_id, month_year, amount, due_date)
     VALUES (?, ?, ?, ?)`,
    [booking_id, month_year, amount, due_date],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ id: this.lastID, ...req.body });
    }
  );
});

// Mark fee as paid
router.put('/:id/pay', authMiddleware, (req, res) => {
  db.run(
    `UPDATE fees SET status = 'paid', payment_date = CURRENT_DATE, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [req.params.id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Fee marked as paid' });
    }
  );
});

// Get pending fees
router.get('/status/pending', (req, res) => {
  db.all(
    `SELECT f.*, s.name as student_name FROM fees f
     JOIN bookings b ON f.booking_id = b.id
     JOIN students s ON b.student_id = s.id
     WHERE f.status = 'pending'`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

module.exports = router;
