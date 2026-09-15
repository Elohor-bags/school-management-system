const express = require('express');
const router = express.Router();
const { getAllStudents, updateGrade, getStudentAnalytics, sendNotification, markAttendance } = require('../controllers/teacherController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.use(authMiddleware, roleMiddleware(['teacher']));

router.get('/students', getAllStudents);
router.post('/grades', updateGrade);
router.get('/analytics/:studentId', getStudentAnalytics);
router.post('/notifications', sendNotification);
router.post('/attendance', markAttendance);

module.exports = router;
