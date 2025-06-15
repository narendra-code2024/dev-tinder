const mangoose = require("mongoose");
const { Schema } = mangoose;

const connectionRequestSchema = new Schema(
	{
		fromUserId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		toUserId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		status: {
			type: String,
			enum: {
				values: ["interested", "ignored", "accepted", "rejected"],
				message: "{VALUE} is not a valid status",
			},
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mangoose.model("ConnectionRequest", connectionRequestSchema);
