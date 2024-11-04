'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  restaurant.init({
    name: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
    name_EN: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    category: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    rating: {
      type: DataTypes.DECIMAL(2,1),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'restaurant',
  });
  return restaurant;
};