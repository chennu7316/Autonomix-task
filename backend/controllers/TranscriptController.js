const TranscriptService = require('../services/TranscriptService');
const logger = require('../utils/logger');

class TranscriptController {
  async getAllTranscripts(req, res) {
    try {
      const transcripts = await TranscriptService.getAllTranscripts();
      res.json(transcripts);
    } catch (error) {
      logger.error('Error in getAllTranscripts:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getTranscriptById(req, res) {
    try {
      const { id } = req.params;
      const transcript = await TranscriptService.getTranscriptById(id);
      res.json(transcript);
    } catch (error) {
      logger.error('Error in getTranscriptById:', error);
      if (error.message === 'Transcript not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async createTranscript(req, res) {
    try {
      const { title, content, meeting_date, participants } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const transcript = await TranscriptService.createTranscript({
        title,
        content,
        meeting_date,
        participants
      });

      res.status(201).json({
        id: transcript.id,
        message: 'Transcript created and action items generated successfully'
      });
    } catch (error) {
      logger.error('Error in createTranscript:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async updateTranscript(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const transcript = await TranscriptService.updateTranscript(id, updateData);
      res.json({ message: 'Transcript updated successfully', transcript });
    } catch (error) {
      logger.error('Error in updateTranscript:', error);
      if (error.message === 'Transcript not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async deleteTranscript(req, res) {
    try {
      const { id } = req.params;
      await TranscriptService.deleteTranscript(id);
      res.json({ message: 'Transcript and related action items deleted successfully' });
    } catch (error) {
      logger.error('Error in deleteTranscript:', error);
      if (error.message === 'Transcript not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async getTranscriptStats(req, res) {
    try {
      const stats = await TranscriptService.getTranscriptStats();
      res.json(stats);
    } catch (error) {
      logger.error('Error in getTranscriptStats:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TranscriptController();


