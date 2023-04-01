const express = require("express");
const mongoose = require("mongoose");
const app = express();
const uri =
  "mongodb+srv://user:prajwal@test.9d8onym.mongodb.net/?retryWrites=true&w=majority";
const PORT = 4000;
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
app.use(bodyParser.json());

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Atlas connected");

    //routes
    app.get("/login/", (req, res) => {
      res.json("user");
    });
    app.get("/signUp/", (req, res) => {
      res.json("created user");
    });
    app.get("/loginAdmin/", (req, res) => {});
  })
  .catch((err) => {
    console.error("MongoDB Atlas connection error: ", err);
  });

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

server.on("error", (err) => {
  console.error(`Server error: ${err}`);
});
