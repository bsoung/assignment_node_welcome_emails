const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(
        'local-login',
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true
            },
            function(req, username, password, done) {
                User.findOne({ email: username }, function(err, user) {
                    if (err) return done(err);
                    if (!user) {
                        return done(null, false);
                    }

                    if (!bcrypt.compareSync(password, user.password)) {
                        return done(null, false);
                    }

                    req.session.fname = user.fname;
                    req.session.email = user.email;
                    return done(null, user);
                });
            }
        )
    );
};
