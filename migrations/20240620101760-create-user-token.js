"use strict";

// /* @type {import('sequelize-cli').Migration} /
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_token", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.SMALLINT,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      token_uuid: {
        unique: true,
        type: Sequelize.STRING,
        // defaultValue: Sequelize.UUIDV4,
        allowNull: true,
      },
      token_expireAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      refresh_token_uuid: {
        unique: true,
        type: Sequelize.STRING,
        allowNull: true,
      },
      refresh_token_expireAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_token");
  },
};
