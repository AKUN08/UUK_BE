'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscriptions', {
      sub_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36)
      },
       users_id: {
        type: Sequelize.STRING(36),
        references: {
          model: 'users',
          key: 'users_id',
        },
        allowNull: false,
      },
      service_id: {
        type: Sequelize.STRING(36),
        references: {
          model: 'service_providers',
          key: 'service_id',
        },
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive')
      },
      registered_at: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('subscriptions');
  }
};