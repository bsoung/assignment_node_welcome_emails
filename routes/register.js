const router = require('express').Router();

router.get('/', (req, res, next) => {
	res.render('register/index');
});

module.exports = router;
