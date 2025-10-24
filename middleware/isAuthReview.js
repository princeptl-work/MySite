const Review = require("../models/review");
async function isAuthReview(req, res, next) {
  let { rid } = req.params;
  let review = await Review.findOne({ _id: rid }).populate("reviewer");
  if (review.reviewer._id.equals(req.user._id)) {
    next();
  } else {
    req.flash("error", "You are not autherized to perform this operation .");
    res.redirect("/");
  }
}
module.exports = isAuthReview;
