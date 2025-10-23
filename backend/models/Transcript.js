const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transcript = sequelize.define('Transcript', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  meeting_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  participants: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'processing', 'completed', 'failed'),
    defaultValue: 'draft'
  }
}, {
  tableName: 'transcripts',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['title']
    },
    {
      fields: ['meeting_date']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Transcript;


