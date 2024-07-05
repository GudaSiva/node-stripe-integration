"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SubscriptionPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SubscriptionPlan.init(
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
      plan_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      plan_description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      plan_features: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      plan_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      plan_id: {
        type: DataTypes.STRING,
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
      modelName: "SubscriptionPlan",
      tableName: "subscription_plan",
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "delete_at",
    }
  );
  return SubscriptionPlan;
};
