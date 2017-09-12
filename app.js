const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('express-flash-messages');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const passport = require('passport');
const app = express();
require('dotenv').config();

// session
app.use(
	session({
		cookie: { maxAge: 60000 },
		secret: 'woot',
		resave: false,
		saveUninitialized: false
	})
);

app.use(passport.initialize());
app.use(passport.session());

// bluebird mongoose
mongoose.Promise = Promise;

// passport
const localAuth = require('./services/passport')(passport);

// connect to mongoose
const beginConnection = mongoose.connect(process.env.DB_URI, {
	useMongoClient: true
});

beginConnection
	.then(db => {
		console.log('DB CONNECTION SUCCESS');
	})
	.catch(err => {
		console.error(err);
	});

// view engine setup
app.engine(
	'handlebars',
	exphbs({
		defaultLayout: 'main'
	})
);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(flash());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/register', require('./routes/register'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/login', require('./routes/login'));
app.use('/email', require('./routes/email'));
app.use('/api', require('./routes/api'));

// auth routes
app.post(
	'/login',
	passport.authenticate('local-login', {
		successRedirect: '/dashboard',
		failureRedirect: '/login',
		failureFlash: true
	})
);

app.post('/logout', (req, res, next) => {
	req.logout();

	res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
