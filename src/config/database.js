const mangoose = require("mongoose");

const connectDB = async () => {
	mangoose.connect(
		"mongodb+srv://imnarendrak:Q3UX3T0gHWHTh95D@cluster0.8idt08y.mongodb.net/dev-tinder"
	);
};

module.exports = connectDB;
