const { Transcript, ActionItem } = require('../models');
const AIService = require('./AIService');
const logger = require('../utils/logger');

class TranscriptService {
  async getAllTranscripts() {
    try {
      const transcripts = await Transcript.findAll({
        include: [
          {
            model: ActionItem,
            as: 'actionItems',
            attributes: ['id', 'status']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      return transcripts.map(transcript => ({
        ...transcript.toJSON(),
        action_item_count: transcript.actionItems.length,
        completed_actions: transcript.actionItems.filter(item => item.status === 'completed').length
      }));
    } catch (error) {
      logger.error('Error fetching transcripts:', error);
      throw new Error('Failed to fetch transcripts');
    }
  }

  async getTranscriptById(id) {
    try {
      const transcript = await Transcript.findByPk(id, {
        include: [
          {
            model: ActionItem,
            as: 'actionItems'
          }
        ]
      });

      if (!transcript) {
        throw new Error('Transcript not found');
      }

      return transcript;
    } catch (error) {
      logger.error('Error fetching transcript:', error);
      throw error;
    }
  }

  async createTranscript(transcriptData) {
    try {
      const { title, content, meeting_date, participants } = transcriptData;

      // Validate required fields
      if (!title || !content) {
        throw new Error('Title and content are required');
      }

      // Create transcript
      const transcript = await Transcript.create({
        title,
        content,
        meeting_date: meeting_date ? new Date(meeting_date) : null,
        participants,
        status: 'processing'
      });

      // Generate action items using AI
      try {
        await AIService.generateActionItems(content, transcript.id);
        await transcript.update({ status: 'completed' });
      } catch (aiError) {
        logger.error('AI processing failed:', aiError);
        await transcript.update({ status: 'failed' });
        // Create a fallback action item
        await ActionItem.create({
          transcript_id: transcript.id,
          title: 'Review meeting transcript',
          description: 'Review the meeting transcript and identify action items manually',
          assignee: 'TBD',
          priority: 'medium',
          ai_generated: false
        });
      }

      return transcript;
    } catch (error) {
      logger.error('Error creating transcript:', error);
      throw error;
    }
  }

  async updateTranscript(id, updateData) {
    try {
      const transcript = await Transcript.findByPk(id);
      if (!transcript) {
        throw new Error('Transcript not found');
      }

      await transcript.update(updateData);
      return transcript;
    } catch (error) {
      logger.error('Error updating transcript:', error);
      throw error;
    }
  }

  async deleteTranscript(id) {
    try {
      const transcript = await Transcript.findByPk(id);
      if (!transcript) {
        throw new Error('Transcript not found');
      }

      // Delete associated action items first
      await ActionItem.destroy({
        where: { transcript_id: id }
      });

      await transcript.destroy();
      return true;
    } catch (error) {
      logger.error('Error deleting transcript:', error);
      throw error;
    }
  }

  async getTranscriptStats() {
    try {
      const totalTranscripts = await Transcript.count();
      const processingTranscripts = await Transcript.count({
        where: { status: 'processing' }
      });
      const completedTranscripts = await Transcript.count({
        where: { status: 'completed' }
      });
      const failedTranscripts = await Transcript.count({
        where: { status: 'failed' }
      });

      return {
        total: totalTranscripts,
        processing: processingTranscripts,
        completed: completedTranscripts,
        failed: failedTranscripts
      };
    } catch (error) {
      logger.error('Error fetching transcript stats:', error);
      throw error;
    }
  }
}

module.exports = new TranscriptService();
