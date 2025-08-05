const { User } = require("../models/User.js");
//Sign up routes
module.exports.renderSignupPage=(req, res) => {
  res.render("Users/signup.ejs");
}

module.exports.signup =async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      let newUser = User({ username, email });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Mughal's Online Hotel Reservation");
        res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  }

//Login Routes
module.exports.renderLoginPage=(req, res) => {
  res.render("Users/login.ejs");
}

module.exports.login=async (req, res, next) => {
    req.flash("success", "Welcome to Mughal's Online Hotel Reservation");
    let url = res.locals.redirectUrl || "/listings";
    res.redirect(url);
  }


  //logout method
  module.exports.logout=(req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are successfully logged out");
    res.redirect("/listings");
  });
}