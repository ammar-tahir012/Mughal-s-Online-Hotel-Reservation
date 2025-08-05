const { Listing } = require("../models/Listing.js");
const { Review } = require("../models/Reviews.js");

//post request for reviews
module.exports.postReview=async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    console.log(req.body);
    let review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);
    await listing.save();
    await review.save();
    console.log(listing);
    console.log(review);
    req.flash("success", "New review added successfully");
    res.redirect(`/listings/${listing._id}/viewlisting`);
  }

//Delete Review
module.exports.destroyReview=async (req, res, next) => {
    let { id, reviewid } = req.params;
    let review = await Review.findByIdAndDelete(reviewid);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    console.log(review);
    req.flash("success", "Review deleted successfully");
    res.redirect(`/listings/${id}/viewlisting`);
  }