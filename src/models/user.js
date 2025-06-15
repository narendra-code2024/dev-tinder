const mangoose = require("mongoose");
const validator = require("validator");
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
			required: true,
			minlength: 3,
			maxlength: 50,
		},
		email: {
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
		},
		photoUrl: {
			type: String,
			validate(value) {
				if (!validator.isURL(value)) {
					throw new Error("Invalid URL");
				}
			},
		},
		age: {
			type: Number,
			min: 18,
		},
		gender: {
			type: String,
			enum: {
				values: ["male", "female", "other"],
				message: "{VALUE} is not a valid gender",
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
