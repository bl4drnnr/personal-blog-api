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

    await queryInterface.bulkDelete('categories', null, {});
    await queryInterface.bulkDelete('articles', null, {});

    await queryInterface.bulkDelete('certificates', null, {});
    await queryInterface.bulkDelete('socials', null, {});
    await queryInterface.bulkDelete('experience_positions', null, {});
    await queryInterface.bulkDelete('experiences', null, {});

    await queryInterface.bulkDelete('authors', null, {});
    await queryInterface.bulkDelete('confirmation_hashes', null, {});
    await queryInterface.bulkDelete('end_users', null, {});
    await queryInterface.bulkDelete('newsletters', null, {});

    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('users_settings', null, {});
  }
};
