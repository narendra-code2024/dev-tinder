const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/feed", userAuth, async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;

		let limit = parseInt(req.query.limit) || 10;
		limit = limit > 50 ? 50 : limit;

		const skip = (page - 1) * limit;

		const loggedInUser = req.user;

		const existingConnections = await ConnectionRequest.find({
			$or: [
				{ toUserId: loggedInUser._id },
				{ fromUserId: loggedInUser._id },
			],
		});

		const hideUserIds = existingConnections.map((conn) => {
			if (conn.fromUserId.equals(loggedInUser._id)) {
				return conn.toUserId;
			}
			return conn.fromUserId;
		});

		const users = await User.find({
			_id: { $nin: [loggedInUser._id, ...hideUserIds] },
		})
			.select(SAFE_DATA)
			.skip(skip)
			.limit(limit);

		return res.status(200).json({
			data: users,
		});
	} catch (err) {
		res.status(500).send(err.message);
	}
});

module.exports = userRouter;
