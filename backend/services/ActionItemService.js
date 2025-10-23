const { ActionItem, Transcript, ProgressTracking } = require('../models');
const logger = require('../utils/logger');

class ActionItemService {
  async getAllActionItems(filters = {}) {
    try {
      const whereClause = {};
      
      if (filters.status) {
        whereClause.status = filters.status;
      }
      if (filters.priority) {
        whereClause.priority = filters.priority;
      }
      if (filters.assignee) {
        whereClause.assignee = filters.assignee;
      }

      const actionItems = await ActionItem.findAll({
        where: whereClause,
        include: [
          {
            model: Transcript,
            as: 'transcript',
            attributes: ['id', 'title']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      return actionItems;
    } catch (error) {
      logger.error('Error fetching action items:', error);
      throw new Error('Failed to fetch action items');
    }
  }

  async getActionItemsByTranscript(transcriptId) {
    try {
      const actionItems = await ActionItem.findAll({
        where: { transcript_id: transcriptId },
        include: [
          {
            model: Transcript,
            as: 'transcript',
            attributes: ['id', 'title']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      return actionItems;
    } catch (error) {
      logger.error('Error fetching action items by transcript:', error);
      throw error;
    }
  }

  async getActionItemById(id) {
    try {
      const actionItem = await ActionItem.findByPk(id, {
        include: [
          {
            model: Transcript,
            as: 'transcript',
            attributes: ['id', 'title']
          },
          {
            model: ProgressTracking,
            as: 'progressHistory',
            order: [['created_at', 'DESC']]
          }
        ]
      });

      if (!actionItem) {
        throw new Error('Action item not found');
      }

      return actionItem;
    } catch (error) {
      logger.error('Error fetching action item:', error);
      throw error;
    }
  }

  async createActionItem(actionItemData) {
    try {
      const { transcript_id, title, description, assignee, due_date, priority } = actionItemData;

      if (!title) {
        throw new Error('Title is required');
      }

      const actionItem = await ActionItem.create({
        transcript_id,
        title,
        description,
        assignee,
        due_date: due_date ? new Date(due_date) : null,
        priority: priority || 'medium',
        ai_generated: false
      });

      return actionItem;
    } catch (error) {
      logger.error('Error creating action item:', error);
      throw error;
    }
  }

  async updateActionItem(id, updateData) {
    try {
      const actionItem = await ActionItem.findByPk(id);
      if (!actionItem) {
        throw new Error('Action item not found');
      }

      await actionItem.update(updateData);
      return actionItem;
    } catch (error) {
      logger.error('Error updating action item:', error);
      throw error;
    }
  }

  async updateActionItemStatus(id, status, notes = null, updatedBy = null) {
    try {
      const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status. Must be one of: ' + validStatuses.join(', '));
      }

      const actionItem = await ActionItem.findByPk(id);
      if (!actionItem) {
        throw new Error('Action item not found');
      }

      const previousStatus = actionItem.status;
      await actionItem.update({ status });

      // Log the status change
      await ProgressTracking.create({
        action_item_id: id,
        status,
        notes,
        updated_by: updatedBy
      });

      logger.info(`Action item ${id} status changed from ${previousStatus} to ${status}`);
      return actionItem;
    } catch (error) {
      logger.error('Error updating action item status:', error);
      throw error;
    }
  }

  async deleteActionItem(id) {
    try {
      const actionItem = await ActionItem.findByPk(id);
      if (!actionItem) {
        throw new Error('Action item not found');
      }

      await actionItem.destroy();
      return true;
    } catch (error) {
      logger.error('Error deleting action item:', error);
      throw error;
    }
  }

  async getActionItemStats() {
    try {
      const total = await ActionItem.count();
      const pending = await ActionItem.count({ where: { status: 'pending' } });
      const inProgress = await ActionItem.count({ where: { status: 'in_progress' } });
      const completed = await ActionItem.count({ where: { status: 'completed' } });
      const cancelled = await ActionItem.count({ where: { status: 'cancelled' } });

      // Priority statistics
      const highPriority = await ActionItem.count({ where: { priority: 'high' } });
      const mediumPriority = await ActionItem.count({ where: { priority: 'medium' } });
      const lowPriority = await ActionItem.count({ where: { priority: 'low' } });

      return {
        total,
        pending,
        in_progress: inProgress,
        completed,
        cancelled,
        high_priority: highPriority,
        medium_priority: mediumPriority,
        low_priority: lowPriority
      };
    } catch (error) {
      logger.error('Error fetching action item stats:', error);
      throw error;
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
      throw error;
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
      throw error;
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
      throw error;
    }
  }
}

module.exports = new ActionItemService();
