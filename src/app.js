const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Narendra",
    lastName: "Babu",
    emailId: "narendra.babu@in",
    password: "123456",
    age: 25,
  });

  try {
    await user.save();
    res.status(201).send("User created successfully");
  } catch (err) {
    res.status(500).send(err);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
