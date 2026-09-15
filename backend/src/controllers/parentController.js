const db = require('../models/db');

const getChildren = async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. Find parent profile
    const parentResult = await db.query('SELECT id FROM Parents WHERE user_id = $1', [userId]);
    const parent = parentResult.rows[0];

    if (!parent) return res.status(404).json({ error: 'Parent profile not found' });

    // 2. Find linked students
    const studentResult = await db.query(
      `SELECT s.id, s.student_id_number, u.first_name, u.last_name, s.grade_level
       FROM Students s
       JOIN Users u ON s.user_id = u.id
       WHERE s.parent_id = $1`,
      [parent.id]
    );

    res.json(studentResult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch children' });
  }
};

const getChildAttendance = async (req, res) => {
  const { childId } = req.params;

  try {
    const result = await db.query(
      'SELECT * FROM Attendance WHERE student_id = $1 ORDER BY date DESC',
      [childId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
};

const getChildGrades = async (req, res) => {
  const { childId } = req.params;

  try {
    const result = await db.query(
      'SELECT * FROM AcademicRecords WHERE student_id = $1 ORDER BY created_at DESC',
      [childId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
};

const getEvents = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Events ORDER BY event_date ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

const getMyNotifications = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      'SELECT * FROM Notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

module.exports = { getChildren, getChildAttendance, getChildGrades, getEvents, getMyNotifications };
