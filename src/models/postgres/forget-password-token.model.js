"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ForgetPasswordToken extends Model {}
  ForgetPasswordToken.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      token_uuid: {
        unique: true,
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_active: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      expiresAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        allowNull: true,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "ForgetPasswordToken",
      timestamps: true,
      tableName: "forget_password_token",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return ForgetPasswordToken;
};
