"use strict";
const {
  userConstants: { Status, UserType, Gender },
} = require("../src/constants");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
      },
      first_name: {
        type: Sequelize.STRING,
      },
      last_name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.ENUM(Gender.MALE, Gender.FEMALE, Gender.OTHERS),
        defaultValue: Gender.MALE,
      },
      phone_number: {
        type: Sequelize.STRING(15),
      },
      password: {
        type: Sequelize.STRING(150),
      },
      user_type: {
        type: Sequelize.ENUM(UserType.Admin, UserType.SubAdmin, UserType.User),
        defaultValue: UserType.User,
      },
      status: {
        type: Sequelize.ENUM(Status.Active, Status.INACTIVE),
        defaultValue: Status.Active,
      },
      is_email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable("user");
  },
};
