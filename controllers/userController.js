const { User } = require('../models');

module.exports = {
	index: async (req, res) => {
		try {
			const users = await User.find();

			return res.json({
				confirmation: 'success',
				result: users
			});
		} catch (e) {
			return res.json({
				confirmation: 'fail',
				message: e.message
			});
		}
	},

	view: async (req, res) => {
		const id = req.params.id;

		try {
			const user = await User.findById(id);

			return res.json({
				confirmation: 'success',
				result: user
			});
		} catch (e) {
			return res.json({
				confirmation: 'fail',
				message: e.message
			});
		}
	},

	create: async (req, res, next) => {
		// check if user exists
		let existingUser;
		try {
			existingUser = await User.findOne({
				email: req.body.email
			});

			if (existingUser) {
				return res.redirect('/');
			}
		} catch (e) {
			return res.json({
				confirmation: 'fail',
				message: e.message
			});
		}

		try {
			let user = await User.create(req.body);

			return res.redirect('/dashboard');
		} catch (e) {
			console.error(e.stack);
			return res.json({
				confirmation: 'fail',
				message: e.message
			});
		}
	}
};
