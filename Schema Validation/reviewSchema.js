const joi = require("joi");
const ExpressError = require("../utils/ExpressError.js");
const reviewSchema = joi.object({
  rating: joi.number().min(1).max(5).required(),
  comment: joi.string().required(),
});

function validateReview(req, res, next) {
  if (req.body.rating) req.body.rating = Number(req.body.rating);
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let err = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, err);
  } else {
    next();
  }
}
module.exports = validateReview;
