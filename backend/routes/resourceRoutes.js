const express = require('express');
const router = express.Router();
const {
    getResources,
    createResource,
    deleteResource,
} = require('../controllers/resourceController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

/**
 * @swagger
 * /api/resources:
 *   get:
 *     tags: [Resources]
 *     summary: Get all study resources
 *     responses:
 *       200:
 *         description: OK
 *   post:
 *     tags: [Resources]
 *     summary: Upload a new resource (Admin/Faculty only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Created
 */
router.route('/')
    .get(getResources)
    .post(protect, authorize('admin', 'faculty'), upload.single('file'), createResource);

/**
 * @swagger
 * /api/resources/{id}:
 *   delete:
 *     tags: [Resources]
 *     summary: Delete a resource
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Resource deleted
 */
router.route('/:id')
    .delete(protect, authorize('admin', 'faculty'), deleteResource);

module.exports = router;
