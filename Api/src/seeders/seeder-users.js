'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      username: 'keishjn',
      email: 'askdbasjdn@gmail.com',
      number: '0900090909',
      password_hash: '123456',
      full_name: 'alalala',
      bio: 'nahanahanahaasdmkasdmsad',
      profile_picture_url: 'dvncnxvxcvghks',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
