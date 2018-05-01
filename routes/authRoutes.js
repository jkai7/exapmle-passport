//==  Passport | Sign Up, Login, Logout & Passport | Strategies and Social Login Lessons

// routes/auth-routes.js
const express      = require("express");
const authRoutes   = express.Router();
const passport     = require("passport");
// User model
const User         = require("../models/user");
// Bcrypt to encrypt passwords == must install bcrypt first 
const bcrypt       = require("bcrypt");
const bcryptSalt   = 10;
const flash        = require("connect-flash");
//== secret page
const ensureLogin  = require("connect-ensure-login");



authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username; //== req.body connects to name in form
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });//== this is the message passed through in the if of our signup
    return;
  }

  User.findOne({ username: username }, "username", (err, user) => {
    if (user !== null) {//== if user exits
      res.render("auth/signup", { message: "Sorry The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username: username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});
//== login route
authRoutes.get("/login", (req, res, next) => {
    res.render("auth/login", { "message": req.flash("error") });//== require flash
  });
  
  authRoutes.post("/login", passport.authenticate("local", { //== looks at new passport local strategy in app.js
    successRedirect: "/private-page",// redirect to secrect page after login
    failureRedirect: "/login",
    failureFlash: true, //== flash message
    passReqToCallback: true //== have access to req in callback
  }));

  //== logout
  authRoutes.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
  });
  
  //== private page
  authRoutes.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => { //if not logged in, redirect to login
    res.render("auth/private", { user: req.user });
  });


module.exports = authRoutes;