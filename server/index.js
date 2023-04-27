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
const Property = require("./models/property");
const { throws } = require("assert");

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
      const { email, password, account } = req.body;

      try {
        // check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).send({ message: "Invalid email or password" });
        }

        if (account !== user.metasMaskAcc) {
          return res
            .status(400)
            .send({ message: "metamask account does not match" });
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
        res.status(500).send({ message: "error while sign in" });
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
          isAdmin: false,
        });
        await user.save();

        // generate a JWT token and send it back to the client
        const token = jwt.sign({ userId: user._id }, "SECRET KEY");
        res.send({ token, user });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "error while signup" });
      }
    });

    app.post("/updateUser/:userId", async (req, res) => {
      const { userId } = req.params;
      const { newAccount } = req.body;
      try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
          return res.status(401).send({ message: "user not found" });
        }
        user.metasMaskAcc = newAccount;
        const updatedUser = await user.save();

        res.status(200).send({ updatedUser });
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "error while getting user data" });
      }
    });
    app.post("/reqForApproveProperty/", async (req, res) => {
      const { image, document, price, location, description, user } = req.body;
      try {
        const property = new Property({
          image,
          document,
          price,
          location,
          description,
          user,
        });
        await property.save();
        res.status(200).send({ property });
      } catch (err) {
        console.log(err);
        res.status(500).send({ message: "error while creating property" });
      }
    });
    app.get("/allProperties/", async (req, res) => {
      try {
        const properties = await Property.find({});
        res.status(200).send(properties);
      } catch (err) {
        console.log(err);
        res.status(500).send({ message: "error while fetching property" });
      }
    });
    app.get("/properties/:userId", async (req, res) => {
      try {
        const { userId } = req.params;
        const properties = await Property.find({ "user._id": userId });

        res.status(200).json(properties);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
        res.status(500).json({ error: "Failed to fetch properties" });
      }
    });
    app.put("/properties/:id", async (req, res) => {
      try {
        // Extract the property ID from request parameters
        const { id } = req.params;
        var property = "";
        if (req.body.isSold !== undefined) {
          property = await Property.findOne({ tokenId: req.body.tokenId });
        } else {
          property = await Property.findById(id);
        }

        if (!property) {
          return res.status(404).json({ error: "Property not found" });
        }

        // Update the property with the new data
        if (req.body.isApproved !== undefined)
          property.isApproved = req.body.isApproved;
        if (req.body.isListed !== undefined) {
          property.isListed = req.body.isListed;
          property.tokenId = req.body.tokenId;
        }
        if (req.body.isSold !== undefined) {
          property.isSold = req.body.isSold;
          property.user = req.body.user;
        }

        // Save the updated property to the database
        const updatedProperty = await property.save();

        // Return the updated property as the response
        res.status(200).json(updatedProperty);
      } catch (err) {
        console.error("Failed to update property:", err);
        res.status(500).json({ error: "Failed to update property" });
      }
    });
    app.post("/updateProperty/", async (req, res) => {
      try {
        const property = await Property.findOne({ tokenId: req.body.tokenId });
        if (req.body.newPrice !== undefined) {
          property.price = req.body.newPrice;
          property.isSold = req.body.isSold;
        }
        const updatedProperty = await property.save();
        res.status(200).send({ updatedProperty });
      } catch (err) {
        console.log(err);
        console.error("Failed to update property:", err);
        res.status(500).json({ error: "Failed to update property" });
      }
    });
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
