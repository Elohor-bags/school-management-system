const express = require('express');
const router = express.Router();
const { clockInOut, getMyGrades } = require('../controllers/studentController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.use(authMiddleware, roleMiddleware(['student']));

router.post('/clock', clockInOut);
router.get('/grades', getMyGrades);

module.exports = router;
