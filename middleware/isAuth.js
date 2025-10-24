const Listing = require("../models/listing");
async function isAuth(req, res, next) {
  let { id } = req.params;
  let listing = await Listing.findOne({ _id: id }).populate("owner");
  if (listing.owner._id.equals(req.user._id)) {
    next();
  } else {
    req.flash("error", "You are not autherized to perform this operation .");
    res.redirect("/");
  }
}
module.exports = isAuth;
