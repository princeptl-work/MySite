const Listing = require("../models/listing");

module.exports.home = async (req, res) => {
  let data = await Listing.find();
  res.render("home", { title: "Home", listings: data });
};
module.exports.newListing = async (req, res) => {
  // let {title, image, location, country, description, price } = req.body;
  // const list = new Listing({title : title, image : image, location : location , country : country ,description : description, price : price});
  let url = req.file.path;
  let { filename } = req.file;
  let list = new Listing(req.body.listing);
  list.owner = req.user;
  list.image = { url: url, filename: filename };
  await list.save();
  req.flash("msg", "New listing created successfully");
  res.redirect("/");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findOne({ _id: id })
    .populate({
      path: "reviews",
      populate: {
        path: "reviewer",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exits !");
    return res.redirect("/");
  }
  res.render("listing", { title: listing.title, listing });
};

module.exports.addPage = (req, res) => {
  res.render("add", { title: "Add" });
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findOneAndDelete({ _id: id });
  req.flash("msg", "Listing deleted successfully ");
  res.redirect("/");
};

module.exports.editPage = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findOne({ _id: id });
  if (!listing) {
    req.flash("error", "Listing does not exits !");
    return res.redirect("/");
  }
  let url = listing.image.url;
  url.replace("/upload", "/upload/w_250");
  res.render("edit", { title: "Edit", listing ,url});
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  if (req.file && req.file.path && req.file.filename)
    req.body.listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  await Listing.findOneAndUpdate({ _id: id }, req.body.listing, {
    runValidators: true,
  });
  req.flash("msg", "Listing updated successfully ");
  res.redirect("/");
};
