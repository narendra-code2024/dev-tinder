const mangoose = require("mongoose");

const { Schema } = mangoose;

const userSchema = new Schema({
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
			if (value !== "male" && value !== "female" && value !== "other") {
				throw new Error("Invalid gender");
			}
		},
	},
	about: {
		type: String,
	},
	skills: {
		type: [String],
	}
}, {
	timestamps: true
});

module.exports = mangoose.model("User", userSchema);
