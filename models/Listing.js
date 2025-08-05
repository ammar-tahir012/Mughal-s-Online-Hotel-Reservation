const mongoose = require("mongoose");
const { Review } = require("./Reviews");

//Database Setup
/*main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Reservation");
}*/

//Adding a mock entry for testing
// const hotel = new Listing({
//   name: "ALpine",
//   price: 400,
//   description: "Good hotel actually",
// });
// hotel
//   .save()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log("There was some error");
//   });

//Mongoose Schema
const listingModel = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

listingModel.post("findOneAndDelete", async (listing) => {
  if (listing) {
    let deleted = await Review.deleteMany({ _id: { $in: listing.reviews } });
    console.log(deleted);
  }
});

const Listing = mongoose.model("Listing", listingModel);
module.exports = { Listing };

//Adding entries in Database
