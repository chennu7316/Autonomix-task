const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication to all routes
router.use(authenticateToken);

// Get dashboard statistics
router.get('/stats', DashboardController.getDashboardStats);

// Get recent activity
router.get('/recent-activity', DashboardController.getRecentActivity);

// Get action items by status (for charts)
router.get('/action-items-by-status', DashboardController.getActionItemsByStatus);

// Get action items by priority
router.get('/action-items-by-priority', DashboardController.getActionItemsByPriority);

// Get monthly progress data
router.get('/monthly-progress', DashboardController.getMonthlyProgress);

// Get overdue action items
router.get('/overdue-items', DashboardController.getOverdueItems);

module.exports = router;
