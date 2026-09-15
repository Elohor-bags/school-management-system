const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

const register = async (req, res) => {
  const { email, password, role, first_name, last_name } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    // 1. Create User
    const userResult = await db.query(
      'INSERT INTO Users (email, password_hash, role, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [email, passwordHash, role, first_name, last_name]
    );
    const userId = userResult.rows[0].id;

    // 2. Create Role-specific Profile
    if (role === 'student') {
      const { student_id_number, grade_level, section, parent_id } = req.body;
      await db.query(
        'INSERT INTO Students (user_id, student_id_number, grade_level, section, parent_id) VALUES ($1, $2, $3, $4, $5)',
        [userId, student_id_number, grade_level, section, parent_id]
      );
    } else if (role === 'parent') {
      const { phone_number, address } = req.body;
      await db.query(
        'INSERT INTO Parents (user_id, phone_number, address) VALUES ($1, $2, $3)',
        [userId, phone_number, address]
      );
    } else if (role === 'teacher') {
      const { employee_id, specialization } = req.body;
      await db.query(
        'INSERT INTO Teachers (user_id, employee_id, specialization) VALUES ($1, $2, $3)',
        [userId, employee_id, specialization]
      );
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM Users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role, name: `${user.first_name} ${user.last_name}` }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = { register, login };
