const express = require('express');
const { db } = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all bookings
router.get('/', (req, res) => {
  db.all(
    `SELECT b.*, s.name as student_name, s.email, r.room_number, r.rent_per_month
     FROM bookings b
     JOIN students s ON b.student_id = s.id
     JOIN rooms r ON b.room_id = r.id`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Get booking by ID
router.get('/:id', (req, res) => {
  db.get(
    `SELECT b.*, s.name as student_name, r.room_number
     FROM bookings b
     JOIN students s ON b.student_id = s.id
     JOIN rooms r ON b.room_id = r.id
     WHERE b.id = ?`,
    [req.params.id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Booking not found' });
      res.json(row);
    }
  );
});

// Create booking
router.post('/', authMiddleware, (req, res) => {
  const { student_id, room_id, check_in_date } = req.body;

  if (!student_id || !room_id || !check_in_date) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  db.run('BEGIN TRANSACTION');

  db.run(
    `INSERT INTO bookings (student_id, room_id, check_in_date)
     VALUES (?, ?, ?)`,
    [student_id, room_id, check_in_date],
    function (err) {
      if (err) {
        db.run('ROLLBACK');
        return res.status(400).json({ error: err.message });
      }

      const bookingId = this.lastID;

      // Update room occupancy
      db.run(
        `UPDATE rooms SET current_occupancy = current_occupancy + 1 WHERE id = ?`,
        [room_id],
        (err) => {
          if (err) {
            db.run('ROLLBACK');
            return res.status(400).json({ error: err.message });
          }

          db.run('COMMIT');
          res.status(201).json({ id: bookingId, ...req.body });
        }
      );
    }
  );
});

// Update booking
router.put('/:id', authMiddleware, (req, res) => {
  const { check_out_date, status } = req.body;

  db.run(
    `UPDATE bookings SET check_out_date = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [check_out_date, status, req.params.id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Booking updated successfully' });
    }
  );
});

// Check out student (end booking)
router.post('/:id/checkout', authMiddleware, (req, res) => {
  db.get('SELECT * FROM bookings WHERE id = ?', [req.params.id], (err, booking) => {
    if (err || !booking) return res.status(404).json({ error: 'Booking not found' });

    db.run('BEGIN TRANSACTION');

    db.run(
      `UPDATE bookings SET check_out_date = CURRENT_DATE, status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [req.params.id],
      (err) => {
        if (err) {
          db.run('ROLLBACK');
          return res.status(400).json({ error: err.message });
        }

        db.run(
          `UPDATE rooms SET current_occupancy = current_occupancy - 1 WHERE id = ?`,
          [booking.room_id],
          (err) => {
            if (err) {
              db.run('ROLLBACK');
              return res.status(400).json({ error: err.message });
            }

            db.run('COMMIT');
            res.json({ message: 'Student checked out successfully' });
          }
        );
      }
    );
  });
});

module.exports = router;
