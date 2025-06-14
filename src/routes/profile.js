const express = require("express");
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
	try {
		res.status(200).send(req.user);
	} catch (err) {
		res.status(500).send(err);
	}
});

module.exports = profileRouter;
