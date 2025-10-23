const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ActionItem = sequelize.define('ActionItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  transcript_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'transcripts',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  assignee: {
    type: DataTypes.STRING,
    allowNull: true
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  ai_generated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'action_items',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['transcript_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['assignee']
    },
    {
      fields: ['due_date']
    }
  ]
});

module.exports = ActionItem;


