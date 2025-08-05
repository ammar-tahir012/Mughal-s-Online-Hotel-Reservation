const Joi = require("joi");
module.exports.listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.object({
    url: Joi.string().required(),
    filename: Joi.string().required(),
  }),
  price: Joi.number().min(10).required(),
  location: Joi.string().required(),
  country: Joi.string().required(),
  // })
}).required();

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().min(1).max(5),
  }).required(),
});
