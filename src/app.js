const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		res.status(201).send("User created successfully");
	} catch (err) {
		res.status(500).send(err);
	}
});

// get user by email
app.get("/user", async (req, res) => {
	try {
		const user = await User.findOne({ emailId: req.body.emailId });

		if (!user) {
			res.status(404).send("User not found");
		}

		res.status(200).send(user);
	} catch (err) {
		res.status(500).send(err);
	}
});

// get all users for feed
app.get("/feed", async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).send(users);
	} catch (err) {
		res.status(500).send(err);
	}
});

// delete user
app.delete("/user", async (req, res) => {
	try {
		await User.findByIdAndDelete(req.body.userId);
		res.status(200).send("User deleted successfully");
	} catch (err) {
		res.status(500).send(err);
	}
});

// update user
app.patch("/user", async (req, res) => {
	try {
		await User.findByIdAndUpdate(req.body.userId, req.body, {
			returnDocument: "before",
		});

		res.status(200).send("User updated successfully");
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
