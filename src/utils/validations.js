const validator = require("validator");

const validateSignupData = (req) => {
	const { firstName, lastName, emailId, password } = req.body;
	if (
        ! firstName ||
        ! lastName ||
        ! emailId ||
        ! password
	) {
        console.log("empty");
		throw new Error("All fields are required");
	} else if (! validator.isEmail(emailId)) {
        console.log("email");
		throw new Error("Invalid email");
	} else if (! validator.isStrongPassword(password)) {
        console.log("password");
		throw new Error("Password is not strong enough");
	}
};

module.exports = {
	validateSignupData,
};
