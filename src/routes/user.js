const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const user = require("../models/user");

const userRouter = express.Router();

const SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;

		const pendingRequests = await ConnectionRequest.find({
			toUserId: loggedInUser._id,
			status: "interested",
		}).populate("fromUserId", SAFE_DATA);

		return res.status(200).json({
			message: "Data fetched successfully",
			data: pendingRequests,
		});
	} catch (err) {
		return res.status(500).json({
			message: err.message,
		});
	}
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;

		const connections = await ConnectionRequest.find({
			$or: [
				{ fromUserId: loggedInUser._id },
				{ toUserId: loggedInUser._id },
			],
			status: "accepted",
		})
			.populate("fromUserId", SAFE_DATA)
			.populate("toUserId", SAFE_DATA);

		const data = connections.map((conn) => {
			if (conn.fromUserId._id.equals(loggedInUser._id)) {
				return conn.toUserId;
			}
			return conn.fromUserId;
		});

		return res.status(200).json({
			message: "Data fetched successfully",
			data,
		});
	} catch (err) {
		return res.status(500).json({
			message: err.message,
		});
	}
});

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
