const Admin = require("../models/adminModel");
const router = require("../routes/user");
const generateToken = require("../utils/generateToken");
const register = async (req, res) => {
	try {
		const { username, password } = req.body;
		if (!username) {
			return res.status(400).send({
				success: false,
				error: "Please enter username",
			});
		}
		if (!password) {
			return res.status(400).send({
				success: false,
				error: "Please enter your password",
			});
		}
		const preUser = await Admin.findOne({ username: username });
		if (preUser) {
			return res.status(400).send({
				success: false,
				error: "User with same username already exist",
			});
		}
		const user = new Admin({ username, password });
		const savedUser = await user.save();
		res.status(200).send({
			success: true,
			data: {
				_id: savedUser._id,
				username: savedUser.username,
			},
		});
	} catch (e) {
		console.log(e);
		return res.status(500).send({
			success: false,
			error: `Server error ${e}`,
		});
	}
};

const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		if (!username) {
			return res.status(400).send({
				success: false,
				error: "Please enter your username",
			});
		}
		if (!password) {
			return res.status(400).send({
				success: false,
				error: "Please enter your password",
			});
		}
		const user = await Admin.findOne({ username: username });
		if (user && (await user.matchPassword(password))) {
			const currentToken = generateToken(user._id);
			const updatedTokens = [...user.tokens, currentToken];
			user.tokens = updatedTokens;
			await user.save();
			res.status(200).json({
				success: true,
				data: {
					_id: user._id,
					username: user.username,
					token: currentToken,
				},
			});
		} else {
			return res.status(401).json({
				success: false,
				error: "Wrong email or password",
			});
		}
	} catch (e) {
		console.log(e);
		return res.status(500).send({
			success: false,
			error: `Server error ${e}`,
		});
	}
};

const logout = async (req, res) => {
	try {
		const user = req.user;
		if (!user) {
			return res.status(401).send({
				success: false,
				error: "Not Authenticated",
			});
		}
		const currentToken = req.token;
		const tokens = user.tokens;
		const newTokens = tokens.filter((token) => {
			return token !== currentToken;
		});
		user.tokens = newTokens;
		await user.save();
		return res.status(200).send({
			success: true,
			message: "Successfully logged out",
		});
	} catch (e) {
		console.log(e);
		return res.status(500).send({
			success: false,
			error: `Server error${e}`,
		});
	}
};


const logoutAll = async (req, res) => {
	try {
		const user = req.user;
		if (!user) {
			return res.status(401).send({
				success: false,
				error: "Not Authenticated",
			});
		}
		user.tokens = [];
		await user.save();
		return res.status(200).send({
			success: true,
			message: "Successfully logged out from all devices",
		});
	} catch (e) {
		console.log(e);
		return res.status(500).send({
			success: false,
			error: `Server error${e}`,
		});
	}
};

module.exports = { register, login , logout, logoutAll };
