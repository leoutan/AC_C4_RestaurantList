'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('restaurants', 'image', {
        type: Sequelize.STRING(255),
        allowNull: true
      })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('restaurants', 'image', {
        type: Sequelize.STRING(50),
        allowNull: true
      })
  }
};
