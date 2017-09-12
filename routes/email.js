const router = require('express').Router();
const EmailService = require('../services/email');

router.get('/', (req, res, next) => {
	let user = req.session.user;
	res.render('new_email/index');
});

router.post('/new', (req, res, next) => {
	// const options = {
	// 	from: 'soungbenjamin@gmail.com',
	// 	to: req.body.email,
	// 	subject: 'You have been registered!!',
	// 	text: `Welcome to the site! Here is a record of your account information. Name: ${req
	// 		.body.fname} ${req.body.lname}. Email: ${req.body.email}. Password: ${req
	// 		.body.password}.`,
	// 	html: `<div><h4>Welcome to the site! Here is a record of your account information:</h4><ul><li>Name: ${req
	// 		.body.fname} ${req.body.lname}</li><li>Email: ${req.body
	// 		.email}</li><li>Password: ${req.body.password}</li></ul></div>`
	// };

	const options = {
		from: req.session.user.email,
		to: req.body.to,
		subject: req.body.subject,
		text: req.body.text,
		html: `<div>${req.body.text}</div>`
	};

	console.log(options);

	EmailService.send(options)
		.then(result => {
			let parsedResult = {};
			req.flash('success', 'Sent!');

			if (result.envelope) {
				parsedResult.to = result.envelope.to;
				parsedResult.from = result.envelope.from;
			} else {
				parsedResult =
					result.message[0].toUpperCase() + result.message.slice(1);
			}

			res.render('emails/index', { parsedResult });
		})
		.catch(next);
});

module.exports = router;
