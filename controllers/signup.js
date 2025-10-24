const User = require("../models/user");
module.exports.signupPage = (req, res) => {
  res.render("signup", { title: "Sign Up" });
};
module.exports.singup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let user = new User({ username: username, email: email });
    await User.register(user, password);
    req.login(user, (err) => {
      if (err) return next(err);
      else {
        req.flash("msg", "Sign up successful");
        res.redirect("/");
      }
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};
