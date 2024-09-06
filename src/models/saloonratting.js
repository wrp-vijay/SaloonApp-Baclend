'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class saloonratting extends Model {
    static associate(models) {
      // Define association with the User model
      saloonratting.belongsTo(models.User, { foreignKey: 'user_id' });
      // Define association with the Saloon model
      saloonratting.belongsTo(models.Saloon, { foreignKey: 'saloon_id' });
    }
  }
  
  saloonratting.init({
    saloon_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    rating: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Saloonratting',
  });
  
  return saloonratting;
};
