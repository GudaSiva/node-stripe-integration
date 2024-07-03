"use strict";
require("dotenv").config();
const i18n = require("i18n");
const cors = require("cors");
const express = require("express");
const globalConfig = require("./src/configs/global.config");
const { hindiTranslations } = require("./locales/hindi");
const { englishTranslations } = require("./locales/english");
const { setLocalLang } = require("./src/middlewares/i18n.middleware");
const { langConstants } = require("./src/constants");
const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
//Internationalization Configuration
i18n.configure({
  locales: langConstants.locale,
  defaultLocale: langConstants.default_locale,
  staticCatalog: {
    hindi: hindiTranslations,
    english: englishTranslations,
  },
  header: "accept-language",
  extension: ".js",
  retryInDefaultLocale: true,
});

app.use(i18n.init);
app.use("/api/v1", express.static("public"), require("./src/routes/api/v1"));

app.use((req, res, next) => {
  res.__ = setLocalLang;
  next();
});

app.listen(globalConfig.port, () => {
  console.log(`Server is running on port ${globalConfig.port}`);
});

module.exports = app;
