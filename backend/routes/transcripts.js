const express = require('express');
const router = express.Router();
const TranscriptController = require('../controllers/TranscriptController');
const { transcriptSchema, validateRequest } = require('../utils/validation');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication to all routes
router.use(authenticateToken);

// Get all transcripts
router.get('/', TranscriptController.getAllTranscripts);

// Get single transcript
router.get('/:id', TranscriptController.getTranscriptById);

// Create new transcript
router.post('/', validateRequest(transcriptSchema), TranscriptController.createTranscript);

// Update transcript
router.put('/:id', validateRequest(transcriptSchema), TranscriptController.updateTranscript);

// Delete transcript
router.delete('/:id', TranscriptController.deleteTranscript);

// Get transcript statistics
router.get('/stats/overview', TranscriptController.getTranscriptStats);

module.exports = router;
