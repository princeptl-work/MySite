const joi = require("joi");
const ExpressError = require("../utils/ExpressError.js");
const listingSchema = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      country: joi.string().required(),
      location: joi.string().required(),
      price: joi.number().required().min(0),
      image: joi.object({
        url: joi.string(),
        filename: joi.string(),
      }),
    })
    .required(),
});
function validateListing(req, res, next) {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let err = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, err);
  } else {
    next();
  }
}
module.exports = validateListing;
