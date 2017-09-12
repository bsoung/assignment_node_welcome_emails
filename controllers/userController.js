const { User } = require('../models');

module.exports = {
	index: async (req, res) => {
		try {
			const users = await User.find({ order: ['id'] });

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
				username: req.body.username
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

		// create our user with random id
		try {
			let user = await User.create(req.body);

			return res.redirect('/email');
		} catch (e) {
			console.error(e.stack);
			return res.json({
				confirmation: 'fail',
				message: e.message
			});
		}
	}
};
