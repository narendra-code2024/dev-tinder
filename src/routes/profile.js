const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditData } = require("../utils/validations");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
	try {
		res.json({
			data: req.user,
		});
	} catch (err) {
		res.status(500).send(err.message);
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

		res.json({
			message: `${loggedInUser.firstName}, your profile updated successfully`,
			data: loggedInUser,
		});
	} catch (err) {
		res.status(500).send(err.message);
	}
});

module.exports = profileRouter;
