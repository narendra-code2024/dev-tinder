const mangoose = require("mongoose");
const validator = require("validator");

const { Schema } = mangoose;

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 50,
		},
		lastName: {
			type: String,
		},
		emailId: {
			type: String,
			lowercase: true,
			trim: true,
			required: true,
			unique: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("Invalid email");
				}
			},
		},
		password: {
			type: String,
			required: true,
			validate(value) {
				if (!validator.isStrongPassword(value)) {
					throw new Error("Invalid password");
				}
			},
		},
		age: {
			type: Number,
			min: 18,
		},
		gender: {
			type: String,
			validate(value) {
				if (
					value !== "male" &&
					value !== "female" &&
					value !== "other"
				) {
					throw new Error("Invalid gender");
				}
			},
		},
		about: {
			type: String,
		},
		skills: {
			type: [String],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mangoose.model("User", userSchema);
