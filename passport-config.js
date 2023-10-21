const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = require("./user"); // Define the User model

// Define the User model

passport.use(
  new LocalStrategy(async function (username, password, done) {
    let user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false, { message: "Incorrect username." });
    }
    if (user.password !== password) {
      return done(null, false, { message: "Incorrect password." });
    }
    return done(null, user);
  })
);

passport.serializeUser(function (user, done) {
  console.log("user at registration");
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  let user = await User.findOne({ _id: id });
  if (user) {
    done(null, user);
  } else {
    console.log("User not found");
    done("404", false);
  }
});

module.exports = passport;
