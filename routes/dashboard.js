const router = require('express').Router();
const { isLoggedIn } = require('../middleware');
const { User } = require('../models');

router.get('/', isLoggedIn, async (req, res, next) => {
	const users = await User.find();

	console.log(req.session);
	console.log(users, 'list of users');

	const result = {
		name: req.session.fname,
		users
	};

	res.render('dashboard/index', { result });
});

module.exports = router;
