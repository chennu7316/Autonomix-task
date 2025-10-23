const ActionItemService = require('../services/ActionItemService');
const logger = require('../utils/logger');

class ActionItemController {
  async getAllActionItems(req, res) {
    try {
      const { status, priority, assignee } = req.query;
      const filters = { status, priority, assignee };
      
      const actionItems = await ActionItemService.getAllActionItems(filters);
      res.json(actionItems);
    } catch (error) {
      logger.error('Error in getAllActionItems:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getActionItemsByTranscript(req, res) {
    try {
      const { transcriptId } = req.params;
      const actionItems = await ActionItemService.getActionItemsByTranscript(transcriptId);
      res.json(actionItems);
    } catch (error) {
      logger.error('Error in getActionItemsByTranscript:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getActionItemById(req, res) {
    try {
      const { id } = req.params;
      const actionItem = await ActionItemService.getActionItemById(id);
      res.json(actionItem);
    } catch (error) {
      logger.error('Error in getActionItemById:', error);
      if (error.message === 'Action item not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async createActionItem(req, res) {
    try {
      const { transcript_id, title, description, assignee, due_date, priority } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const actionItem = await ActionItemService.createActionItem({
        transcript_id,
        title,
        description,
        assignee,
        due_date,
        priority
      });

      res.status(201).json({
        id: actionItem.id,
        message: 'Action item created successfully'
      });
    } catch (error) {
      logger.error('Error in createActionItem:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async updateActionItem(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const actionItem = await ActionItemService.updateActionItem(id, updateData);
      res.json({ message: 'Action item updated successfully', actionItem });
    } catch (error) {
      logger.error('Error in updateActionItem:', error);
      if (error.message === 'Action item not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async updateActionItemStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, notes, updated_by } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const actionItem = await ActionItemService.updateActionItemStatus(id, status, notes, updated_by);
      res.json({ message: 'Action item status updated successfully', actionItem });
    } catch (error) {
      logger.error('Error in updateActionItemStatus:', error);
      if (error.message === 'Action item not found') {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes('Invalid status')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async deleteActionItem(req, res) {
    try {
      const { id } = req.params;
      await ActionItemService.deleteActionItem(id);
      res.json({ message: 'Action item deleted successfully' });
    } catch (error) {
      logger.error('Error in deleteActionItem:', error);
      if (error.message === 'Action item not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async getActionItemStats(req, res) {
    try {
      const stats = await ActionItemService.getActionItemStats();
      res.json(stats);
    } catch (error) {
      logger.error('Error in getActionItemStats:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getOverdueItems(req, res) {
    try {
      const overdueItems = await ActionItemService.getOverdueItems();
      res.json(overdueItems);
    } catch (error) {
      logger.error('Error in getOverdueItems:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ActionItemController();


