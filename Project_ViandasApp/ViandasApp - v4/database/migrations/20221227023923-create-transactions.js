'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      product_id: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      status_id: {
        type: Sequelize.INTEGER
      },
      type_id: {
        type: Sequelize.INTEGER
      },
      currency_id: {
        type: Sequelize.INTEGER
      },
      productQuantity: {
        type: Sequelize.INTEGER
      },
      productPrice: {
        type: Sequelize.DECIMAL
      },
      productTax: {
        type: Sequelize.DECIMAL
      },
      transactionAmount: {
        type: Sequelize.DECIMAL
      },
      description: {
        type: Sequelize.STRING
      },
      deliveryCharge: {
        type: Sequelize.DECIMAL
      },
      paymentMethod_id: {
        type: Sequelize.INTEGER
      },
      paymentStatus_id: {
        type: Sequelize.INTEGER
      },
      transactionPaymentId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};