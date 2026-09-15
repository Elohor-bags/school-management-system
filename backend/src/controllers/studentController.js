const db = require('../models/db');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const clockInOut = async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  try {
    // Find student profile
    const studentResult = await db.query('SELECT id, parent_id FROM Students WHERE user_id = $1', [userId]);
    const student = studentResult.rows[0];

    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    // Check for existing attendance today
    const attendanceResult = await db.query(
      'SELECT * FROM Attendance WHERE student_id = $1 AND date = $2',
      [student.id, today]
    );
    const attendance = attendanceResult.rows[0];

    if (!attendance) {
      // First sign-in of the day
      await db.query(
        'INSERT INTO Attendance (student_id, date, status, check_in_time) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)',
        [student.id, today, 'present']
      );
      return res.json({ message: 'Signed in successfully' });
    } else if (!attendance.check_out_time) {
      // Sign-out
      await db.query(
        'UPDATE Attendance SET check_out_time = CURRENT_TIMESTAMP WHERE id = $1',
        [attendance.id]
      );
      return res.json({ message: 'Signed out successfully' });
    } else {
      return res.status(400).json({ error: 'Already signed out for today' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Attendance update failed' });
  }
};

const getMyGrades = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      `SELECT ar.* FROM AcademicRecords ar
       JOIN Students s ON ar.student_id = s.id
       WHERE s.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
};

module.exports = { clockInOut, getMyGrades };
