const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validations");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

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

		const isPasswordValid = await user.comparePassword(req.body.password);

		if (!isPasswordValid) {
			res.status(404).send("Invalid credentials");
		}

		const token = await user.getJWT();

		res.cookie("token", token, {
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		});

		res.status(200).send("Login successful");
	} catch (err) {
		res.status(500).send(err.message);
	}
});

// profile
app.get("/profile", userAuth, async (req, res) => {
	try {
		res.status(200).send(req.user);
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
