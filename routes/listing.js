const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const { isLogged, isOwner, validateListing } = require("../middleware.js");
const ListingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

//Index Route Path
router
  .route("/")
  .get(wrapasync(ListingController.showRoute))
  .post(
    isLogged,
    //validateListing,
    upload.single("image"),
    wrapasync(ListingController.postListing)
  );

//View Listing (show route)
router.get("/:id/viewlisting", wrapasync(ListingController.viewListing));

//Add a listing
router.get("/add", isLogged, wrapasync(ListingController.renderListingForm));

//Editing
router.get(
  "/:id/edit",
  isLogged,
  isOwner,
  wrapasync(ListingController.renderEditForm)
);

router
  .route("/:id")
  .patch(
    isLogged,
    isOwner,
    upload.single("image"),
    validateListing,
    wrapasync(ListingController.editListing)
  )
  .delete(isLogged, isOwner, wrapasync(ListingController.destroyListing));

module.exports = router;
