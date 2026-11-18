'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('billings', {
      bil_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36)
      },
      sub_id: {
        type: Sequelize.STRING(36),
        references: {
          model: 'subscriptions',
          key: 'sub_id',
        },
        allowNull: false,
      },
      period_month: {
        type: Sequelize.INTEGER
      },
      period_year: {
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2)
      },
      due_date: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM('pending', 'paid', 'failed')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATETIME
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATETIME
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('billings');
  }
};