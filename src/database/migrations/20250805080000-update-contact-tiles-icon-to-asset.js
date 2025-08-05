'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new iconAssetId column
    await queryInterface.addColumn('contact_tiles', 'icon_asset_id', {
      type: Sequelize.UUID,
      allowNull: true, // Allow null temporarily during migration
      references: {
        model: 'static_assets',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Remove the old icon column
    await queryInterface.removeColumn('contact_tiles', 'icon');
  },

  async down(queryInterface, Sequelize) {
    // Add back the icon column
    await queryInterface.addColumn('contact_tiles', 'icon', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '📱'
    });

    // Remove the iconAssetId column
    await queryInterface.removeColumn('contact_tiles', 'icon_asset_id');
  }
};
