"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserSubscription extends Model {
    static associate(models) {
      models.UserSubscription.belongsTo(models.SubscriptionPlan, {
        foreignKey: "subscription_plan_id",
        as: "UserSubscriptionPlanDetails",
      });
    }
  }
  UserSubscription.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        comment: "Primary key",
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        comment: "Unique Identifier",
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "User",
          key: "id",
        },
        defaultValue: null,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      subscription_plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "SubscriptionPlan",
          key: "id",
        },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      },
      plan_title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      stripe_subscription_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        defaultValue: "Active",
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      deleted_at: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "UserSubscription",
      tableName: "user_subscription",
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return UserSubscription;
};
