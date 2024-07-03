"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserToken extends Model {
    static associate(models) {
      models.UserToken.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  UserToken.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.SMALLINT,
        references: {
          model: "User",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      token_uuid: {
        unique: true,
        type: DataTypes.STRING,
        // defaultValue: DataTypes.UUIDV4,
        allowNull: true,
      },
      token_expireAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      refresh_token_uuid: {
        unique: true,
        type: DataTypes.STRING,
        allowNull: true,
      },
      refresh_token_expireAt: {
        type: DataTypes.DATE,
        allowNull: true,
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
      deleted_at: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "UserToken",
      timestamps: true,
      tableName: "user_token",
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at"
    },
  );
  return UserToken;
};
