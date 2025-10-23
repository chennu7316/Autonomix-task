const Joi = require('joi');

const transcriptSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  content: Joi.string().min(1).required(),
  meeting_date: Joi.alternatives().try(
    Joi.date(),
    Joi.string().allow(''),
    Joi.valid(null)
  ).optional(),
  participants: Joi.string().allow('').optional()
});

const actionItemSchema = Joi.object({
  transcript_id: Joi.number().integer().optional(),
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().allow('').optional(),
  assignee: Joi.string().allow('').optional(),
  due_date: Joi.alternatives().try(
    Joi.date(),
    Joi.string().allow(''),
    Joi.valid(null)
  ).optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional()
});

const statusUpdateSchema = Joi.object({
  status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').required(),
  notes: Joi.string().optional(),
  updated_by: Joi.string().optional()
});

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

module.exports = {
  transcriptSchema,
  actionItemSchema,
  statusUpdateSchema,
  validateRequest
};
