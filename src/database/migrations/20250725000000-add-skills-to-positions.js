'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('positions', 'skills', {
      type: Sequelize.JSON,
      allowNull: true,
      after: 'description'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('positions', 'skills');
  }
};
