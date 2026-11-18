'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class billings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.payments, {foreignKey: 'bil_id',as: 'payments'});
      this.belongsTo(models.subscriptions, {foreignKey: 'sub_id',as: 'subscription'});
    }
  }
  billings.init({
    bil_id: {
      type: DataTypes.STRING(36),
      primaryKey: true
    },
    sub_id: {
      type: DataTypes.STRING(36),
      allowNull: false
    },
    period_month: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    period_year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('unpaid', 'waiting_verification', 'paid'),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'billings',
  });
  return billings;
};