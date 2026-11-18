'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class subscriptions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.billings, {foreignKey: 'sub_id',as: 'billings'});
      this.belongsTo(models.users, {foreignKey: 'users_id',as: 'user'});
      this.belongsTo(models.service_providers, {foreignKey: 'service_id',as: 'service_provider'});
    }
  }
  subscriptions.init({
    sub_id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    users_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    service_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false
    },
    registered_at: {
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
    modelName: 'subscriptions',
  });
  return subscriptions;
};