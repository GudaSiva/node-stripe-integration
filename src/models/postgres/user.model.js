"use strict";
const { Model } = require("sequelize");
const {
  userConstants: { Status, UserType, Gender },
} = require("../../constants");
const { generateHash } = require("../../utils/password.util");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      first_name: {
        type: DataTypes.STRING,
      },
      last_name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      gender: {
        type: DataTypes.ENUM(Gender.MALE, Gender.FEMALE, Gender.OTHERS),
        defaultValue: Gender.MALE,
      },
      phone_number: {
        type: DataTypes.STRING(15),
      },
      password: {
        type: DataTypes.STRING(150),
      },
      user_type: {
        type: DataTypes.ENUM(UserType.Admin, UserType.SubAdmin, UserType.User),
        defaultValue: UserType.User,
      },
      status: {
        type: DataTypes.ENUM(Status.Active, Status.INACTIVE),
        defaultValue: Status.Active,
      },
      is_email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      tableName: "user",
      modelName: "User",
      paranoid: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  const encryptPasswordToChanged = async (user) => {
    if (user.changed("password")) {
      user.password = await generateHash(user.get("password"));
    }
  };
  User.beforeCreate(encryptPasswordToChanged);
  return User;
};
