const express = require("express");
const cors = require("cors");
const app = express();
const userModel = require("./model/user");
const feedModel = require("./model/feed");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const dotenv = require("dotenv");

app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// User signup
app.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    let user = await userModel.findOne({ email });
    if (user) return res.status(400).send("Account already exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      email,
      password: hashedPassword,
      username,
    });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err });
  }
});

// User login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    const token = jwt.sign(
      { email: user.email, userid: user._id },
      "gaharwarsinghyuvraj@123455",
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err });
  }
});

// Middleware to check if user is logged in
function isLogin(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("You must be logged in");

  try {
    const data = jwt.verify(token, "gaharwarsinghyuvraj@123455");
    req.user = data;
    next();
  } catch (err) {
    res.status(401).send("Invalid token");
  }
}

app.get("/home", isLogin, (req, res) => {
  res.send("Welcome to the home page!");
});

app.listen(3001, () => {
  console.log(`Server running on port 3001`);
});
