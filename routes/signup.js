const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const signupController = require("../controllers/signup.js");
router
  .route("/")
  .get(signupController.signupPage)
  .post(wrapAsync(signupController.singup));
module.exports = router;
