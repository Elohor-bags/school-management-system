const express = require('express');
const router = express.Router();
const { getChildren, getChildAttendance, getChildGrades, getEvents, getMyNotifications } = require('../controllers/parentController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.use(authMiddleware, roleMiddleware(['parent']));

router.get('/children', getChildren);
router.get('/children/:childId/attendance', getChildAttendance);
router.get('/children/:childId/grades', getChildGrades);
router.get('/events', getEvents);
router.get('/notifications', getMyNotifications);

module.exports = router;
