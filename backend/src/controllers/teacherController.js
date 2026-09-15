const db = require('../models/db');

const getAllStudents = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT s.id, s.student_id_number, s.grade_level, s.section, u.first_name, u.last_name
       FROM Students s
       JOIN Users u ON s.user_id = u.id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

const updateGrade = async (req, res) => {
  const { student_id, subject, score, max_score, term } = req.body;
  const teacherId = req.user.id; // From authMiddleware

  try {
    await db.query(
      `INSERT INTO AcademicRecords (student_id, subject, score, max_score, term, teacher_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET score = $3, max_score = $4`,
      [student_id, subject, score, max_score, term, teacherId]
    );
    res.json({ message: 'Grade updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update grade' });
  }
};

const getStudentAnalytics = async (req, res) => {
  const { studentId } = req.params;

  try {
    const result = await db.query(
      `WITH StudentAverages AS (
          SELECT student_id, AVG(score) as avg_score
          FROM AcademicRecords
          GROUP BY student_id
      ),
      RankedStudents AS (
          SELECT student_id, avg_score,
          RANK() OVER (ORDER BY avg_score DESC) as position
          FROM StudentAverages
      )
      SELECT * FROM RankedStudents WHERE student_id = $1`,
      [studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No academic records found for this student' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to calculate analytics' });
  }
};

const sendNotification = async (req, res) => {
  const { user_id, message } = req.body;

  try {
    await db.query(
      'INSERT INTO Notifications (user_id, message) VALUES ($1, $2)',
      [user_id, message]
    );
    res.json({ message: 'Notification sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send notification' });
  }
};

const markAttendance = async (req, res) => {
  const { student_id, status } = req.body;
  const today = new Date().toISOString().split('T')[0];

  try {
    // 1. Update attendance
    await db.query(
      `INSERT INTO Attendance (student_id, date, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (student_id, date) DO UPDATE SET status = $3`,
      [student_id, today, status]
    );

    // 2. If absent, notify parent
    if (status === 'absent') {
      const studentResult = await db.query('SELECT parent_id FROM Students WHERE id = $1', [student_id]);
      const parentId = studentResult.rows[0]?.parent_id;

      if (parentId) {
        const parentUserResult = await db.query('SELECT user_id FROM Parents WHERE id = $1', [parentId]);
        const parentUserId = parentUserResult.rows[0]?.user_id;

        if (parentUserId) {
          await db.query(
            'INSERT INTO Notifications (user_id, message) VALUES ($1, $2)',
            [parentUserId, `Alert: Your child was marked absent today (${today}).`]
          );
        }
      }
    }

    res.json({ message: 'Attendance marked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
};

module.exports = { getAllStudents, updateGrade, getStudentAnalytics, sendNotification, markAttendance };
