/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      //
    } catch (e) {
      console.log(`Error while wipe of the database: ${e}`);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('sessions', null, {});
    await queryInterface.bulkDelete('users_settings', null, {});
    await queryInterface.bulkDelete('articles', null, {});
    await queryInterface.bulkDelete('projects', null, {});
    await queryInterface.bulkDelete('newsletters', null, {});
    await queryInterface.bulkDelete('site_config', null, {});
    await queryInterface.bulkDelete('pages', null, {});
    await queryInterface.bulkDelete('pages_content', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
