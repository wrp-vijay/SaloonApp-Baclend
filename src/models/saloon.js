'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Saloon extends Model {
    static associate(models) {
      Saloon.hasMany(models.Saloonratting, { as: 'ratings', foreignKey: 'saloon_id' });
      Saloon.belongsTo(models.Saloon, { foreignKey: 'owner_id' });
    }
  }
  Saloon.init({
    owner_id: DataTypes.INTEGER, // Changed to INTEGER to match the owner's id
    saloon_name: DataTypes.STRING,
    mobile_number: DataTypes.STRING,
    rating: DataTypes.INTEGER // Corrected field name to "rating"
  }, {
    sequelize,
    modelName: 'Saloon',
  });
  return Saloon;
};
