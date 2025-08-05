const { Listing } = require("./models/Listing.js");
const { Review } = require("./models/Reviews.js");
const Errorhandler = require("./utils/ErrorHandling.js");
const { reviewSchema, listingSchema } = require("./schemaValidation.js");

//1. check from where the original request is originated and 
// save the origin of the request
module.exports.isLogged = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //console.log(req);
    req.session.redirectUrl = req.originalUrl;
    //console.log(req.originalUrl);
    //console.log(req.session.redirectUrl);
    req.flash(
      "error",
      "You must be logged in to create/edit or delete listing"
    );
    return res.redirect("/login");
  } else {
    next();
  }
};

// 1 cannot be directly done so we created a res.locals
module.exports.savedUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    //console.log(req.session.redirectUrl);
    res.locals.redirectUrl = req.session.redirectUrl;
    //console.log(res.locals.redirectUrl);
  }
  next();
};

//check if the request comes from the real owner of the listing
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (
    res.locals.currUser &&
    listing.owner &&
    !res.locals.currUser._id.equals(listing.owner._id)
  ) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${listing._id}/viewListing`);
  }
  next();
};

//check if the request comes from the real owner of the review
module.exports.isAuthor = async (req, res, next) => {
  const { id, reviewid } = req.params;
  const review = await Review.findById(reviewid);
  if (!res.locals.currUser._id.equals(review.author._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}/viewListing`);
  }
  next();
};

//Validation using joe function
// validation for posting reviews
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new Errorhandler(500, errMsg);
  } else {
    next();
  }
};

//Validation using joe function
// validation for posting listing
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new Errorhandler(500, errMsg);
  } else {
    next();
  }
};
