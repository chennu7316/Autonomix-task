const { Transcript, ActionItem, ProgressTracking } = require('../models');
const logger = require('../utils/logger');

class DashboardService {
  async getDashboardStats() {
    try {
      const [
        totalTranscripts,
        totalActionItems,
        completedActionItems,
        pendingActionItems,
        inProgressActionItems
      ] = await Promise.all([
        Transcript.count(),
        ActionItem.count(),
        ActionItem.count({ where: { status: 'completed' } }),
        ActionItem.count({ where: { status: 'pending' } }),
        ActionItem.count({ where: { status: 'in_progress' } })
      ]);

      const completionRate = totalActionItems > 0 
        ? (completedActionItems / totalActionItems * 100).toFixed(1)
        : 0;

      return {
        totalTranscripts,
        totalActionItems,
        completedActionItems,
        pendingActionItems,
        inProgressActionItems,
        completionRate: parseFloat(completionRate)
      };
    } catch (error) {
      logger.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to fetch dashboard statistics');
    }
  }

  async getRecentActivity(limit = 10) {
    try {
      const [transcripts, actionItems] = await Promise.all([
        Transcript.findAll({
          attributes: ['id', 'title', 'created_at'],
          order: [['created_at', 'DESC']],
          limit: Math.ceil(limit / 2)
        }),
        ActionItem.findAll({
          attributes: ['id', 'title', 'status', 'created_at'],
          order: [['created_at', 'DESC']],
          limit: Math.ceil(limit / 2)
        })
      ]);

      const activities = [
        ...transcripts.map(t => ({
          type: 'transcript',
          id: t.id,
          title: t.title,
          created_at: t.created_at,
          status: null
        })),
        ...actionItems.map(ai => ({
          type: 'action_item',
          id: ai.id,
          title: ai.title,
          created_at: ai.created_at,
          status: ai.status
        }))
      ];

      return activities
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, limit);
    } catch (error) {
      logger.error('Error fetching recent activity:', error);
      throw new Error('Failed to fetch recent activity');
    }
  }

  async getActionItemsByStatus() {
    try {
      const results = await ActionItem.findAll({
        attributes: [
          'status',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
        ],
        group: ['status'],
        raw: true
      });

      return results;
    } catch (error) {
      logger.error('Error fetching action items by status:', error);
      throw new Error('Failed to fetch action items by status');
    }
  }

  async getActionItemsByPriority() {
    try {
      const results = await ActionItem.findAll({
        attributes: [
          'priority',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
        ],
        group: ['priority'],
        raw: true
      });

      return results;
    } catch (error) {
      logger.error('Error fetching action items by priority:', error);
      throw new Error('Failed to fetch action items by priority');
    }
  }

  async getMonthlyProgress() {
    try {
      const results = await ActionItem.findAll({
        attributes: [
          [require('sequelize').fn('DATE_TRUNC', 'month', require('sequelize').col('created_at')), 'month'],
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'total_created'],
          [require('sequelize').fn('COUNT', require('sequelize').fn('CASE', 
            require('sequelize').where(require('sequelize').col('status'), 'completed'), 
            require('sequelize').col('id')
          )), 'completed']
        ],
        where: {
          created_at: {
            [require('sequelize').Op.gte]: require('sequelize').fn('NOW', '-', require('sequelize').literal("INTERVAL '12 months'"))
          }
        },
        group: [require('sequelize').fn('DATE_TRUNC', 'month', require('sequelize').col('created_at'))],
        order: [[require('sequelize').fn('DATE_TRUNC', 'month', require('sequelize').col('created_at')), 'ASC']],
        raw: true
      });

      return results;
    } catch (error) {
      logger.error('Error fetching monthly progress:', error);
      throw new Error('Failed to fetch monthly progress');
    }
  }

  async getOverdueItems() {
    try {
      const overdueItems = await ActionItem.findAll({
        where: {
          due_date: {
            [require('sequelize').Op.lt]: new Date()
          },
          status: {
            [require('sequelize').Op.notIn]: ['completed', 'cancelled']
          }
        },
        include: [
          {
            model: Transcript,
            as: 'transcript',
            attributes: ['id', 'title']
          }
        ],
        order: [['due_date', 'ASC']]
      });

      return overdueItems;
    } catch (error) {
      logger.error('Error fetching overdue items:', error);
      throw new Error('Failed to fetch overdue items');
    }
  }
}

module.exports = new DashboardService();


