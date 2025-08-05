const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { savedUrl } = require("../middleware.js");
const UserController = require("../controllers/users.js");

//Sign up routes
router.get("/signUp", UserController.renderSignupPage);

router.post("/signUp", wrapasync(UserController.signup));

//Login Routes
router.get("/login", UserController.renderLoginPage);

router.post(
  "/login",
  savedUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapasync(UserController.login)
);

//logout method
router.get("/logout", UserController.logout);

module.exports = router;
