'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post, { foreignKey: 'user_id' });
      User.hasMany(models.Comment, { foreignKey: 'user_id' });
      User.hasMany(models.Like, { foreignKey: 'user_id' });
      User.hasMany(models.Follower, { foreignKey: 'user_id' });
      User.hasMany(models.Message, { foreignKey: 'sender_id', as: 'sentMessages' });
      User.hasMany(models.Message, { foreignKey: 'receiver_id', as: 'receivedMessages' });
      User.hasMany(models.Story, { foreignKey: 'user_id' });
      User.hasMany(models.Notification, { foreignKey: 'user_id' });
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    number: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    full_name: DataTypes.STRING,
    bio: DataTypes.TEXT,
    profile_picture_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};