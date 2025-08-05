const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync = require("../utils/wrapasync.js");
const { validateReview, isLogged, isAuthor } = require("../middleware.js");
const ReviewController = require("../controllers/reviews.js");
const { Review } = require("../models/Reviews.js");

router.post(
  "/",
  isLogged,
  validateReview,
  wrapasync(ReviewController.postReview)
);
//Delete request for reviews
router.delete(
  "/:reviewid",
  isLogged,
  isAuthor,
  wrapasync(ReviewController.destroyReview)
);

module.exports = router;
