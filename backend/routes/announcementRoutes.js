const express = require('express');
const router = express.Router();
const {
    getAnnouncements,
    createAnnouncement,
    deleteAnnouncement,
} = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/announcements:
 *   get:
 *     tags: [Announcements]
 *     summary: Get all campus announcements
 *     responses:
 *       200:
 *         description: OK
 *   post:
 *     tags: [Announcements]
 *     summary: Post a new announcement (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Created
 */
router.route('/').get(getAnnouncements).post(protect, authorize('admin'), createAnnouncement);

/**
 * @swagger
 * /api/announcements/{id}:
 *   delete:
 *     tags: [Announcements]
 *     summary: Delete an announcement
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Announcement deleted
 */
router.route('/:id').delete(protect, authorize('admin'), deleteAnnouncement);

module.exports = router;
