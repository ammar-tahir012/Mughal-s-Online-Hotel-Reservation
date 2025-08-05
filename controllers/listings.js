const { Listing } = require("../models/Listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//Index Route
module.exports.showRoute = async (req, res, next) => {
  const hotels = await Listing.find({});
  res.render("./listings/Alllistings.ejs", { hotels });
};

//View Listing (show route)
module.exports.viewListing = async (req, res, next) => {
  const { id } = req.params;
  const hotel = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!hotel) {
    req.flash("error", "Listing doesnot exist");
    res.redirect("/listings");
  } else {
    res.render("listings/viewListing.ejs", { hotel });
  }
};

//Add a listing
module.exports.renderListingForm = async (req, res, next) => {
  res.render("listings/AddListing.ejs");
};

module.exports.postListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
    .send();
  let url = req.file.path;
  let filename = req.file.filename;
  const hotel = req.body;
  const newHotel = new Listing(hotel);
  console.log(res.locals.currUser._id);
  newHotel.owner = res.locals.currUser._id;
  newHotel.image = { url, filename };
  newHotel.geometry = response.body.features[0].geometry;
  await newHotel.save();
  console.log(newHotel);
  req.flash("success", "New Listing added successfully");
  res.redirect("/listings");
};

//Editing
module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const hotel = await Listing.findById(id);
  if (!hotel) {
    req.flash("error", "Listing doesnot exist");
    res.redirect("/listings");
  } else {
    let originalImageUrl = hotel.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    console.log(originalImageUrl);
    res.render("listings/edit.ejs", { hotel, originalImageUrl });
  }
};
module.exports.editListing = async (req, res, next) => {
  const { id } = req.params;
  const hotel = req.body;
  hotel._id = id;
  console.log(hotel);
  let listing = await Listing.findByIdAndUpdate(id, hotel);
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing updated successfully");
  res.redirect(`/listings/${hotel._id}/viewListing`);
};

//Delete Route
module.exports.destroyListing = async (req, res, next) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully");
  res.redirect("/listings");
};
