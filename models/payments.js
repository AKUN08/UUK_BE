'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.billings, {foreignKey: 'bil_id',as: 'billing'});
      this.belongsTo(models.users, {foreignKey: 'verified_by',as: 'verifier'});
    }
  }
  payments.init({
    pay_id: {
      type: DataTypes.STRING(36),
      primaryKey: true
    },
    bil_id: {
      type: DataTypes.STRING(36),
      allowNull: false
    },
    payment_proof: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false
    },
    verified_by: {
      type: DataTypes.STRING(36),
      allowNull: false
    },
    verified_at: {
      type: DataTypes.DATE,
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
    modelName: 'payments',
  });
  return payments;
};