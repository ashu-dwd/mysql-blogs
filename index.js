const express = require("express");
const ejs = require("ejs");
const path = require("path");
const session = require("express-session");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
const port = 5002;
const homeRoute = require("./routes/home");
const userRoute = require("./routes/user");
const blogsRoute = require("./routes/blogs");
const { checkAuthCookie } = require("./middlewares/auth");
require("dotenv").config();
const {conn} = require('./connect');

//express session

app.use(
  session({
    secret: "your-secret-key", // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

//middleware for forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(checkAuthCookie("token"));

//middlewares for Routes

app.use(
  "/coverImages",
  express.static(path.join(__dirname, "public/coverImages"))
);

app.use(
  "/css",
  express.static(path.join(__dirname, "public/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "public/js"))
);
app.use(
  "/profilePics",
  express.static(path.join(__dirname, "public/profilePics"))
);
app.use(express.static("public"));
app.use("/", homeRoute);
app.use("/blogs", blogsRoute);
app.use("/user", userRoute);

//404 page
app.get("*", (req, res) => {
  res.redirect("/404.html");
});

// Setting up EJS as the view engine
app.set("view engine", "ejs");

app.listen(port, () => console.log(`App is listening at port: ${port}`));
