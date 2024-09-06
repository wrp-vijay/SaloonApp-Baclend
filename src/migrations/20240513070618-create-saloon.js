'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the saloons table
    await queryInterface.createTable('saloons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      owner_id: {
        type: Sequelize.INTEGER, // Type INTEGER
        allowNull: false,
        references: {
          model: 'owners', // Referencing the owners table
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      saloon_name: {
        type: Sequelize.STRING,
        allowNull: false // Added not null constraint
      },
      mobile_number: {
        type: Sequelize.STRING,
        allowNull: false // Added not null constraint
      },
      rating: {
        type: Sequelize.INTEGER, // Type INTEGER
        allowNull: true // Assuming rating can be nullable
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    // Drop the saloons table
    await queryInterface.dropTable('saloons');
  }
};
