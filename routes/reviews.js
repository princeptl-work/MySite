const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const validateReview = require("../Schema Validation/reviewSchema");
const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError.js");
const isLoggedIn = require("../middleware/isLoggedIn.js");
const isAuthReview = require("../middleware/isAuthReview.js");
const reviewController = require("../controllers/review.js");
router
  .route("/listing/:id")
  .get(isLoggedIn, wrapAsync(reviewController.reviewPage))
  .post(isLoggedIn, validateReview, wrapAsync(reviewController.addReview));
  
router.delete(
  "/listing/:rid/:lid",
  isLoggedIn,
  isAuthReview,
  wrapAsync(reviewController.deleteReview)
);
module.exports = router;
