'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      pay_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36)
      },
      bil_id: {
        type: Sequelize.STRING(36),
        references: {
          model: 'billings',
          key: 'bil_id',
        },
        allowNull: false,
      },
      payment_proof: {
        type: Sequelize.STRING(255)
      },
      status: {
        type: Sequelize.ENUM('pending', 'paid', 'failed')
      },
      verified_by: {
        type: Sequelize.STRING(36),
        references: {
          model: 'users',
          key: 'users_id',
        },
        allowNull: false,
      },
      verified_at: {
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
    await queryInterface.dropTable('payments');
  }
};