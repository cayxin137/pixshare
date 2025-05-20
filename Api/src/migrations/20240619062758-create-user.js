'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING
      },
      number: {
        type: Sequelize.STRING
      },
      password_hash: {
        type: Sequelize.STRING
      },
      full_name: {
        type: Sequelize.STRING
      },
      bio: {
        type: Sequelize.TEXT
      },
      profile_picture_url: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};