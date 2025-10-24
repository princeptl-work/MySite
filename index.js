require("dotenv").config();
const { storage } = require("./cloudConfig.js");
const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer({ storage });
const mongoose = require("mongoose");
const Review = require("./models/review");
const Listing = require("./models/listing.js");
const User = require("./models/user.js");
const listingController = require("./controllers/listing.js");
const logController = require("./controllers/log.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const port = 8080;
const session = require("express-session");
const MongoStore = require("connect-mongo");
const wrapAsync = require("./utils/wrapAsync.js");
const validateListing = require("./Schema Validation/listingSchema.js");
const validateReview = require("./Schema Validation/reviewSchema.js");
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const signupRouter = require("./routes/signup.js");
const loginRouter = require("./routes/login.js");
const flash = require("connect-flash");
const passport = require("passport");
const Local = require("passport-local");
const isLoggedIn = require("./middleware/isLoggedIn.js");
const db_url = process.env.ATLASDB_URL;
app.listen(port);
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const store = MongoStore.create({
  mongoUrl: db_url,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});
store.on("error", (err) => {
  console.error("Session store error:", err);
});
let sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Local(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main().catch((err) => next(err));
async function main() {
  await mongoose.connect(db_url);
}
app.use((req, res, next) => {
  res.locals.msg = req.flash("msg");
  res.locals.error = req.flash("error");
  res.locals.auth = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});

app.get("/", wrapAsync(listingController.home));
app.post(
  "/",
  isLoggedIn,
  validateListing,
  upload.single("listing[image]"),
  wrapAsync(listingController.newListing)
);

app.get("/logout", isLoggedIn, logController.logout);

app.use("/listing", listingRouter);
app.use("/review", reviewRouter);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);

app.all(/.*/, (req, res, next) => {
  throw new ExpressError(404, "Page not found !!!");
});

app.use((err, req, res, next) => {
  let { status = 400, message = "Something went wrong" } = err;
  res.status(status).render("error", { title: "Error", message });
});
