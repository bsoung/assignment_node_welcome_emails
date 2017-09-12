const EmailService = require('../services/email');
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.render('users_new/index');
});

router.post('/new', (req, res, next) => {
	console.log(req.body, 'this is the req');
	const options = {
		from: 'soungbenjamin@gmail.com',
		to: req.body.email,
		subject: 'You have been registered!!',
		text: `Welcome to the site! Here is a record of your account information. Name: ${req
			.body.fname} ${req.body.lname}. Email: ${req.body.email}. Password: ${req
			.body.password}.`,
		html: `<div><h4>Welcome to the site! Here is a record of your account information:</h4><ul><li>Name: ${req
			.body.fname} ${req.body.lname}</li><li>Email: ${req.body
			.email}</li><li>Password: ${req.body.password}</li></ul></div>`
	};

	EmailService.send(options)
		.then(result => {
			const parsedResult = {};
			req.flash('success', 'Sent!');
			parsedResult.to = result.envelope.to;
			parsedResult.from = result.envelope.from;
			res.render('emails/index', { parsedResult });
		})
		.catch(next);
});

module.exports = router;

/*



app.get('/', (req, res) => {
  res.render('emails/new');
});


app.post('/emails', (req, res, next) => {
  const options = {
    from: req.body.email_options.from,
    to: req.body.email_options.to,
    subject: req.body.email_options.subject,
    text: req.body.email_options.message,
    html: `<p>${ req.body.email_options.message }</p>`
  };

  EmailService.send(options)
    .then((result) => {
      req.flash('success', 'Sent!');
      res.render('emails/new', { result });
    })
    .catch(next);
});
 */
