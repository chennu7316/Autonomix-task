const { sequelize } = require('../config/database');
const Transcript = require('./Transcript');
const ActionItem = require('./ActionItem');
const ProgressTracking = require('./ProgressTracking');

// Define associations
Transcript.hasMany(ActionItem, {
  foreignKey: 'transcript_id',
  as: 'actionItems',
  onDelete: 'CASCADE'
});

ActionItem.belongsTo(Transcript, {
  foreignKey: 'transcript_id',
  as: 'transcript'
});

ActionItem.hasMany(ProgressTracking, {
  foreignKey: 'action_item_id',
  as: 'progressHistory',
  onDelete: 'CASCADE'
});

ProgressTracking.belongsTo(ActionItem, {
  foreignKey: 'action_item_id',
  as: 'actionItem'
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  Transcript,
  ActionItem,
  ProgressTracking
};


