const express = require('express');
const router = express.Router();
const {
    getJobs,
    getJob,
    createJob,
    applyForJob,
    deleteJob,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     tags: [Jobs]
 *     summary: Get all job postings
 *     responses:
 *       200:
 *         description: OK
 *   post:
 *     tags: [Jobs]
 *     summary: Create a new job posting (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Created
 */
router.route('/').get(getJobs).post(protect, authorize('admin'), createJob);

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     tags: [Jobs]
 *     summary: Get job details by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *   delete:
 *     tags: [Jobs]
 *     summary: Delete a job posting
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Job deleted
 */
router.route('/:id').get(getJob).delete(protect, authorize('admin'), deleteJob);

/**
 * @swagger
 * /api/jobs/{id}/apply:
 *   post:
 *     tags: [Jobs]
 *     summary: Apply for a job (Student only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Application submitted
 */
router.route('/:id/apply').post(protect, authorize('student'), applyForJob);

module.exports = router;
