/* eslint-disable radix */
"use strict";
require("dotenv").config();
/*
|--------------------------------------------------------------------------
| DATABASE
|--------------------------------------------------------------------------
*/
const dbHostConfig = {
  host: process.env.PG_HOST,
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DATABASE,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  dialect: process.env.DIALECT,
  dialectOptions: {
    bigNumberStrings: true,
  },
  logging: false,
  pool: {
    max: parseInt(process.env.PG_MAX_POOL_SIZE),
    min: parseInt(process.env.PG_MIN_POOL_SIZE),
    acquire: parseInt(process.env.PG_POOL_ACQUIRE),
    idle: parseInt(process.env.PG_POOL_IDLE),
  },
};
const dbConfig = {
  local: dbHostConfig,
  development: dbHostConfig,
  dev: dbHostConfig,
  production: dbHostConfig,
};
module.exports = dbConfig;
