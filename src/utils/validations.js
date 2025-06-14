const validator = require("validator");

const validateSignupData = (req) => {
	const { firstName, lastName, email, password } = req.body;
	if (
        ! firstName ||
        ! lastName ||
        ! email ||
        ! password
	) {
		throw new Error("All fields are required");
	} else if (! validator.isEmail(email)) {
		throw new Error("Invalid email");
	} else if (! validator.isStrongPassword(password)) {
		throw new Error("Password is not strong enough");
	}
};

module.exports = {
	validateSignupData,
};
