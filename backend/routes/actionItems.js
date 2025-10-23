const express = require('express');
const router = express.Router();
const ActionItemController = require('../controllers/ActionItemController');
const { actionItemSchema, statusUpdateSchema, validateRequest } = require('../utils/validation');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication to all routes
router.use(authenticateToken);

// Get all action items
router.get('/', ActionItemController.getAllActionItems);

// Get action items for a specific transcript
router.get('/transcript/:transcriptId', ActionItemController.getActionItemsByTranscript);

// Get single action item
router.get('/:id', ActionItemController.getActionItemById);

// Create new action item
router.post('/', validateRequest(actionItemSchema), ActionItemController.createActionItem);

// Update action item
router.put('/:id', validateRequest(actionItemSchema), ActionItemController.updateActionItem);

// Update action item status
router.patch('/:id/status', validateRequest(statusUpdateSchema), ActionItemController.updateActionItemStatus);

// Delete action item
router.delete('/:id', ActionItemController.deleteActionItem);

// Get action item statistics
router.get('/stats/overview', ActionItemController.getActionItemStats);

// Get overdue items
router.get('/overdue/items', ActionItemController.getOverdueItems);

module.exports = router;
