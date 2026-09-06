const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Submission = sequelize.define('Submission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  gender: {
    type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
    allowNull: false,
  },
  mobileNumber: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  feedback: { type: DataTypes.TEXT, allowNull: true },
  userCreated: { type: DataTypes.INTEGER, allowNull: false }, // user id who created
  dateCreated: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  userModified: { type: DataTypes.INTEGER, allowNull: true },
  dateModified: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'submissions',
  timestamps: false,
});

Submission.belongsTo(User, { foreignKey: 'userCreated', as: 'creator' });

module.exports = Submission;
