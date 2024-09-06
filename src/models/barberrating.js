'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BarberRating extends Model {
    static associate(models) {
      // Define association with the Barber model
      BarberRating.belongsTo(models.Barber, { foreignKey: 'barber_id' });
      // Define association with the User model
      BarberRating.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  BarberRating.init({
    barber_id: DataTypes.INTEGER,
    rating: DataTypes.INTEGER, // Corrected field name to 'rating'
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BarberRating', // Corrected model name to 'BarberRating'
  });

  return BarberRating;
};
