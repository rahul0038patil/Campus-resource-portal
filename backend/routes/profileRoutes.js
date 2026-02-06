const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getAllStudents, getUserProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(protect, getProfile)
    .put(protect, upload.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'resume', maxCount: 1 }
    ]), updateProfile);

// Routes for Faculty/Admin to view students
router.get('/students', protect, getAllStudents);
router.get('/:id', protect, getUserProfile);

module.exports = router;
