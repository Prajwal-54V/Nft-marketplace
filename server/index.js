const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const uri =
  "mongodb+srv://user:prajwal@test.9d8onym.mongodb.net/?retryWrites=true&w=majority";
const PORT = 4000;
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
app.use(bodyParser.json());
app.use(cors());
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Atlas connected");

    //routes
    app.post("/login/", async (req, res) => {
      const { email, password } = req.body;

      try {
        // check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).send({ message: "Invalid email or password" });
        }

        // check if the password is correct
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).send({ message: "Invalid email or password" });
        }

        // generate a JWT token and send it back to the client
        const token = jwt.sign({ userId: user._id }, "your_secret_key");
        res.status(200).send({ token, user });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Something went wrong" });
      }
    });

    app.post("/signUp/", async (req, res) => {
      const { username, email, password, account } = req.body;

      try {
        // check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).send({ message: "User already exists" });
        }

        // hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 12);

        // create a new user
        const user = new User({
          name: username,
          email,
          password: hashedPassword,
          metasMaskAcc: account,
        });
        await user.save();

        // generate a JWT token and send it back to the client
        const token = jwt.sign({ userId: user._id }, "your_secret_key");
        res.send({ token, user });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Something went wrong" });
      }
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
