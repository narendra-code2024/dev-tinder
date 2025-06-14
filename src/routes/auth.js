const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignupData } = require("../utils/validations");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
	try {
		validateSignupData(req);

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

authRouter.post("/login", async (req, res) => {
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

authRouter.post("/logout", async (req, res) => {
	try {
		res.cookie("token", null, {
			expires: new Date(Date.now()),
		}).send("Logout successful");
	} catch (err) {
		res.status(500).send(err.message);
	}
});

module.exports = authRouter;
