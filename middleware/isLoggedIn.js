function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.url = req.originalUrl;
    req.flash("error", "You must be logged in to perform this task ..");
    return res.redirect("/login");
  }
  next();
}
module.exports = isLoggedIn;
