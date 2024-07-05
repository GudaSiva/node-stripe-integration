"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("subscription_plan", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        comment: "Primary key",
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        comment: "Unique Identifier",
      },
      plan_title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      plan_description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      plan_features: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      plan_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      plan_id: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("Active", "Inactive"),
        defaultValue: "Active",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("subscription-plans");
  },
};
