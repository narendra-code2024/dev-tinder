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

		return res.status(201).json({
			message: "Your profile is created successfully",
		});
	} catch (err) {
		return res.status(400).json({
			message: err.message,
		});
	}
});

authRouter.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });

		if (!user) {
			res.status(404).json({
				message: "Invalid credentials",
			});
		}

		const isPasswordValid = await user.comparePassword(req.body.password);

		if (!isPasswordValid) {
			res.status(404).json({
				message: "Invalid credentials",
			});
		}

		const token = await user.getJWT();

		res.cookie("token", token, {
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		});

		return res.status(200).json({
			message: "Login successful",
		});
	} catch (err) {
		return res.status(500).json({
			message: err.message,
		});
	}
});

authRouter.post("/logout", async (req, res) => {
	try {
		return res
			.cookie("token", null, {
				expires: new Date(Date.now()),
			})
			.json({
				message: "Logout successful",
			});
	} catch (err) {
		return res.status(500).json({
			message: err.message,
		});
	}
});

module.exports = authRouter;
