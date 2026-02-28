import { Router } from 'express';
import { entryController } from '../controllers/entry.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import {
  createEntryValidation,
  updateEntryStatusValidation,
} from '../utils/validators';

const router = Router();

/**
 * @swagger
 * /entries:
 *   post:
 *     summary: Create a new entry (User role)
 *     tags: [Entries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - amount
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *               amount:
 *                 type: number
 *                 minimum: 0
 *     responses:
 *       201:
 *         description: Entry created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authenticate,
  authorize('user'),
  createEntryValidation,
  entryController.createEntry
);

/**
 * @swagger
 * /entries/my:
 *   get:
 *     summary: Get current user's entries
 *     tags: [Entries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Entries retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/my', authenticate, authorize('user'), entryController.getUserEntries);

/**
 * @swagger
 * /entries:
 *   get:
 *     summary: Get all entries with optional status filter (Manager role)
 *     tags: [Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter entries by status
 *     responses:
 *       200:
 *         description: Entries retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Manager role required
 */
router.get(
  '/',
  authenticate,
  authorize('manager'),
  entryController.getAllEntries
);

/**
 * @swagger
 * /entries/{id}:
 *   get:
 *     summary: Get entry by ID
 *     tags: [Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Entry retrieved successfully
 *       404:
 *         description: Entry not found
 */
router.get('/:id', authenticate, entryController.getEntryById);

/**
 * @swagger
 * /entries/{id}/status:
 *   patch:
 *     summary: Update entry status (Manager role)
 *     tags: [Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Entry status updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Manager role required
 *       404:
 *         description: Entry not found
 */
router.patch(
  '/:id/status',
  authenticate,
  authorize('manager'),
  updateEntryStatusValidation,
  entryController.updateEntryStatus
);

/**
 * @swagger
 * /entries/{id}:
 *   delete:
 *     summary: Delete an entry
 *     tags: [Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Entry deleted successfully
 *       404:
 *         description: Entry not found
 */
router.delete('/:id', authenticate, entryController.deleteEntry);

export default router;
