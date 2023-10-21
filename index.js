const express = require("express");
const passport = require("./passport-config");
const session = require("express-session");
const mongoose = require("mongoose");
const User = require("./user"); // Define the User model

const app = express();

mongoose.connect("mongodb://localhost/passport-example", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ... (rest of the code)

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));

// Set up express-session
app.use(
  session({
    secret: "sai",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Set up routes
app.get("/", (req, res) => {
  res.send("Welcome to Passport.js Example");
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

app.get("/register", (req, res) => {
  res.send(`
      <form action="/register" method="post">
        <div>
          <label>Username:</label>
          <input type="text" name="username" required>
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" required>
        </div>
        <button type="submit">Register</button>
      </form>
    `);
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });

  await user.save();
  res.redirect("/login");
});

app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Hello ${req.user.username}! This is your dashboard.`);
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.send(`
    <form action="/login" method="post">
      <div>
        <label>Username:</label>
        <input type="text" name="username" required>
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" required>
      </div>
      <button type="submit">Login</button>
    </form>
  `);
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
