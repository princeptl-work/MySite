const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const validateListing = require("../Schema Validation/listingSchema");
const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError.js");
const isLoggedIn = require("../middleware/isLoggedIn.js");
const isAuth = require("../middleware/isAuth.js");
const listingController = require("../controllers/listing.js");
const { storage } = require("../cloudConfig");
const multer = require("multer");
const upload = multer({ storage });

router.get("/add", isLoggedIn, listingController.addPage);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .delete(isLoggedIn, isAuth, wrapAsync(listingController.deleteListing))
  .patch(
    isLoggedIn,
    isAuth,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.updateListing)
  );

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuth,
  wrapAsync(listingController.editPage)
);
module.exports = router;
