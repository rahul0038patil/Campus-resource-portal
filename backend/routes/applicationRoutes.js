const express = require('express');
const router = express.Router();
const {
    getApplications,
    getMyApplications,
    updateApplicationStatus,
    deleteApplication,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin'), getApplications);
router.get('/my', protect, authorize('student'), getMyApplications);
router.route('/:id')
    .put(protect, authorize('admin'), updateApplicationStatus)
    .delete(protect, authorize('admin'), deleteApplication);

module.exports = router;
