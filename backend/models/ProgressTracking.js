const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProgressTracking = sequelize.define('ProgressTracking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  action_item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'action_items',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  updated_by: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'progress_tracking',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['action_item_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['created_at']
    }
  ]
});

module.exports = ProgressTracking;


