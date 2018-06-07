var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var googleconfig = require('../google.js');
 
	
	module.exports = function(passport) {

    passport.use('google', new GoogleStrategy({
        clientID        : googleconfig.clientID,
        clientSecret    : googleconfig.clientSecret,
        callbackURL     : googleconfig.callbackURL

    },
    function(token, refreshToken, profile, done) {
    	process.nextTick(function() {

	   console.log("Success");

		});

    }));

};
	





