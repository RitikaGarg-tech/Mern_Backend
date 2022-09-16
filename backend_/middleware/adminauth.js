const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

const superProtect = async (req, res, next) => {
	let token;
	try {
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			try {
				token = req.headers.authorization.split(" ")[1];
				const decoded = jwt.verify(token, process.env.JWT_SECRET);
				const user = await Admin.findById(decoded.id).select(
					"-password"
				);
				if (!user.tokens.includes(token)) {
					throw new Error("Not authorized as super admin");
				}
				req.user = user;
				req.token = token;
				next();
			} catch (error) {
				console.error(error);
				throw new Error("Session Expired");
			}
		}
		if (!token) {
			throw new Error("Not authorized as super admin");
		}
	} catch (e) {
		console.log(e);
		let error = `${e}`.split(":");
		let message;
		if (error[0] === "Error") {
			message = error[1];
		} else {
			message = "Authorization Problem";
		}
		res.status(401).json({ success: false, error: message });
	}
};

module.exports = superProtect;