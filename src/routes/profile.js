const express = require("express");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const { validateEditData } = require("../utils/validations");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
	try {
		return res.json({
			data: req.user,
		});
	} catch (err) {
		return res.status(500).json({
			message: err.message,
		});
	}
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
	try {
		validateEditData(req);

		const loggedInUser = req.user;

		Object.keys(req.body).forEach((field) => {
			loggedInUser[field] = req.body[field];
		});

		await loggedInUser.save();

		return res.json({
			message: `${loggedInUser.firstName}, your profile updated successfully`,
			data: loggedInUser,
		});
	} catch (err) {
		return res.status(500).json({
			message: err.message,
		});
	}
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;

		const { currentPassword, newPassword } = req.body;

		const isPasswordValid = await loggedInUser.comparePassword(
			currentPassword
		);

		if (!isPasswordValid) {
			throw new Error("Current password is incorrect");
		}

		loggedInUser.password = await bcrypt.hash(newPassword, 10);

		await loggedInUser.save();

		return res.json({
			message: `${loggedInUser.firstName}, your password updated successfully`,
			data: loggedInUser,
		});
	} catch (err) {
		return res.status(500).json({
			message: err.message,
		});
	}
});

module.exports = profileRouter;
