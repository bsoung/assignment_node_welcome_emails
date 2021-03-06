const router = require('express').Router();

router.get('/', (req, res, next) => {
	if (req.isAuthenticated()) {
		return res.redirect('/dashboard');
	}

	res.render('landing/index');
});

module.exports = router;
