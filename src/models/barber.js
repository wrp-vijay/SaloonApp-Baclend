'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Barber extends Model {
    static associate(models) {
      // Define association with the Saloon model
      Barber.belongsTo(models.Saloon, { foreignKey: 'saloon_id' });

      Barber.hasMany(models.BarberRating, { foreignKey: 'barber_id', as: 'ratings' });
    }
  }
  
  Barber.init({
    saloon_id: DataTypes.INTEGER,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    rating: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Barber',
  });
  
  return Barber;
};
