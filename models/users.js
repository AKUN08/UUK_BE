'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.subscriptions, {foreignKey: 'users_id',as: 'subscriptions'});
      this.hasMany(models.payments, {foreignKey: 'verified_by',as: 'verifier'});
    }
  }
  users.init({
    users_id  : {
      type: DataTypes.STRING(36),
      primaryKey: true,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email:{ 
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    role:{ 
      type: DataTypes.ENUM('customer', 'admin'),
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
    modelName: 'users',
  });
  return users;
};