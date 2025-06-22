const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const requestRouter = express.Router();

requestRouter.post(
	"/request/send/:status/:toUserId",
	userAuth,
	async (req, res) => {
		try {
			const fromUserId = req.user._id;
			const toUserId = req.params.toUserId;
			const status = req.params.status;

			const allowedStatuses = ["interested", "ignored"];

			if (!allowedStatuses.includes(status)) {
				return res.status(400).json({
					message: "Invalid status",
				});
			}

			const toUser = await User.findById(req.params.toUserId);

			if (!toUser) {
				return res.status(404).json({
					message: "User not found",
				});
			}

			if (fromUserId == toUserId) {
				return res.status(400).json({
					message: "You cannot send a connection request to yourself",
				});
			}

			const existingConnectionRequest = await ConnectionRequest.findOne({
				$or: [
					{ fromUserId, toUserId },
					{ fromUserId: toUserId, toUserId: fromUserId },
				],
			});

			if (existingConnectionRequest) {
				return res.status(400).json({
					message: "Connection request already exists",
				});
			}

			const connectionRequest = new ConnectionRequest({
				fromUserId,
				toUserId,
				status: req.params.status,
			});

			await connectionRequest.save();

			return res.status(201).json({
				message: "Connection request sent successfully",
				data: connectionRequest,
			});
		} catch (err) {
			return res.status(500).json({
				message: err.message,
			});
		}
	}
);

requestRouter.post(
	"/request/review/:status/:requestId",
	userAuth,
	async (req, res) => {
		try {
			const { status, requestId } = req.params;
			const loggedInUser = req.user;

			const allowedStatuses = ["accepted", "rejected"];

			if (!allowedStatuses.includes(status)) {
				return res.status(400).json({
					message: "Invalid status",
				});
			}

			const connectionRequest = await ConnectionRequest.findOne({
				_id: req.params.requestId,
				toUserId: loggedInUser._id,
				status: "interested",
			});

			if (!connectionRequest) {
				return res.status(404).json({
					message: "Connection request not found",
				});
			}

			connectionRequest.status = status;

			const data = await connectionRequest.save();

			res.status(200).json({
				message: `Connection request ${status}`,
				data,
			});
		} catch (err) {}
	}
);

module.exports = requestRouter;
