const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validations");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
	try {
		// Validate signup data
		validateSignupData(req);

		// Encrypt password
		const hashedPassword = await bcrypt.hash(req.body.password, 10);

		const user = new User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: hashedPassword,
		});

		await user.save();

		res.status(201).send("User created successfully");
	} catch (err) {
		res.status(400).send(err.message);
	}
});

// login
app.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });

		if (!user) {
			res.status(404).send("Invalid credentials");
		}

		const isPasswordValid = await bcrypt.compare(
			req.body.password,
			user.password
		);

		if (!isPasswordValid) {
			res.status(404).send("Invalid credentials");
		}

		res.status(200).send("Login successful");
	} catch (err) {
		res.status(500).send(err.message);
	}
});

// get user by email
app.get("/user", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });

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
app.patch("/user/:userId", async (req, res) => {
	const userId = req.params?.userId;
	const data = req.body;

	const ALLOWED_UPDATE_FIELDS = [
		"firstName",
		"lastName",
		"password",
		"about",
		"gender",
		"age",
		"skills",
	];

	const isValidUpdate = Object.keys(data).every((k) =>
		ALLOWED_UPDATE_FIELDS.includes(k)
	);

	if (!isValidUpdate) {
		return res.status(400).send({ error: "Invalid update" });
	}

	if (data.skills?.length > 10) {
		throw new Error("Cannot add more than 10 skills");
	}

	try {
		await User.findByIdAndUpdate(userId, data, {
			returnDocument: "after",
			runValidators: true,
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
