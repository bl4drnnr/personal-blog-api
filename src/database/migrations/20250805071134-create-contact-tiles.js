'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contact_tiles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'title'
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'content'
      },
      link: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'link'
      },
      icon: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'icon'
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'sort_order'
      },
      contact_page_id: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'contact_page_id',
        references: {
          model: 'contact_page',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'created_at'
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'updated_at'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contact_tiles');
  }
};
