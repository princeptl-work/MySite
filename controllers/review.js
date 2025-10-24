const Listing = require("../models/listing");
const Review = require("../models/review");
module.exports.reviewPage = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findOne({ _id: id });
  res.render("review", { image: listing.image, title: listing.title, id });
};

module.exports.deleteReview = async (req, res) => {
  let { rid, lid } = req.params;
  await Listing.findByIdAndUpdate(lid, { $pull: { reviews: rid } });
  await Review.findByIdAndDelete(rid);
  res.redirect("/listing/" + lid);
};

module.exports.addReview = async (req, res) => {
  let { id } = req.params;
  let { comment, rating } = req.body;
  const listing = await Listing.findOne({ _id: id });
  if (!listing) {
    req.flash("error", "Listing does not exits !");
    return res.redirect("/");
  }
  const review = new Review({ comment: comment, rating: rating });
  review.reviewer = req.user._id;
  listing.reviews.push(review);
  await review.save();
  await listing.save();
  req.flash("msg", "new review added successfully ");
  res.redirect("/listing/" + id);
};
