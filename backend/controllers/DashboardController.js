const DashboardService = require('../services/DashboardService');
const logger = require('../utils/logger');

class DashboardController {
  async getDashboardStats(req, res) {
    try {
      const stats = await DashboardService.getDashboardStats();
      res.json(stats);
    } catch (error) {
      logger.error('Error in getDashboardStats:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getRecentActivity(req, res) {
    try {
      const { limit = 10 } = req.query;
      const activities = await DashboardService.getRecentActivity(parseInt(limit));
      res.json(activities);
    } catch (error) {
      logger.error('Error in getRecentActivity:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getActionItemsByStatus(req, res) {
    try {
      const data = await DashboardService.getActionItemsByStatus();
      res.json(data);
    } catch (error) {
      logger.error('Error in getActionItemsByStatus:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getActionItemsByPriority(req, res) {
    try {
      const data = await DashboardService.getActionItemsByPriority();
      res.json(data);
    } catch (error) {
      logger.error('Error in getActionItemsByPriority:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getMonthlyProgress(req, res) {
    try {
      const data = await DashboardService.getMonthlyProgress();
      res.json(data);
    } catch (error) {
      logger.error('Error in getMonthlyProgress:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getOverdueItems(req, res) {
    try {
      const overdueItems = await DashboardService.getOverdueItems();
      res.json(overdueItems);
    } catch (error) {
      logger.error('Error in getOverdueItems:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new DashboardController();


