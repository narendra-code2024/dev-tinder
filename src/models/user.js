const mangoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
		email: {
			type: String,
			lowercase: true,
			trim: true,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
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

userSchema.methods.getJWT = async function () {
	return await jwt.sign({ _id: this._id }, "Dev@TinderJWT$!630", {
		expiresIn: "7d",
	});
};

userSchema.methods.comparePassword = async function (passwordInput) {
	return await bcrypt.compare(passwordInput, this.password);
};

module.exports = mangoose.model("User", userSchema);
