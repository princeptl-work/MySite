module.exports.loginPage = (req, res) => {
  res.render("login", { title: "Login" });
};

module.exports.login = async (req, res) => {
  req.flash("msg", "Login successful");
  if (res.locals.url) {
    res.redirect(res.locals.url);
  } else {
    res.redirect("/");
  }
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("msg", "Logged out successfully");
      res.redirect("/");
    }
  });
};
