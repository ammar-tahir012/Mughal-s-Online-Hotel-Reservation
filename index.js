require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
var methodOverride = require("method-override");
engine = require("ejs-mate");
const app = express();
const path = require("path");
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", engine);
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const { User } = require("./models/User.js");
const passport = require("passport");
const localStrategy = require("passport-local");

const uri = process.env.ATLAS_DB_URL;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
//Database Setup
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(uri);
}

//Basic App Setup
const port = 3000;
app.listen(port, () => {
  console.log("App is Listening");
});

app.get("/", (req, res) => {
  res.send("App is working");
});

const store=MongoStore.create({
  mongoUrl:uri,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter:24*3600
});

store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION STORE",err);
})
//session middleware
app.use(
  session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60,
      httpOnly: true,
    },
  })
);

//USER AUTHENTICATION AND AUTHORIZATION
//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//using connect-flash
app.use(flash());

app.use((req, res, next) => {
  console.log(req.user);
  res.locals.successmsg = req.flash("success");
  res.locals.errormsg = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//demoUser
app.get("/demo", async (req, res) => {
  let fakeUser = new User({
    email: "ashar@getMaxListeners.com",
    username: "Ashar Fiaz",
  });
  let newUser = await User.register(fakeUser, "ashar1122");
  res.send(newUser);
});

//Router calls for listings, reviews and users
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//All other invalid routes
//app.use("*catchall", (req, res, next) => {
// next(new Errorhandler(404, "Page not found"));
//});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Optional: Log error details
  let { statuscode = 500, message = "Some Error occured" } = err;
  res.status(statuscode).render("listings/Error.ejs", { message });
});
