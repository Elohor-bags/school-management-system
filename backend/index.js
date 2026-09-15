const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const teacherRoutes = require('./src/routes/teacherRoutes');
const parentRoutes = require('./src/routes/parentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/parent', parentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'School Management System API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
