const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const isLoggedIn = require("../middleware/isLoggedIn.js");
const saveUrl = require("../middleware/saveUrl.js");
const logController = require("../controllers/log.js");
router
  .route("/")
  .get(logController.loginPage)
  .post(
    saveUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),

    wrapAsync(logController.login)
  );
module.exports = router;
