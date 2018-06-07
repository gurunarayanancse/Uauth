var TwitterStrategy  = require('passport-twitter').Strategy;
//var User = require('../models/user');
var twitterConfig = require('../twitter.js');

module.exports = function(passport) {

    passport.use('twitter', new TwitterStrategy({
        consumerKey     : twitterConfig.apikey,
        consumerSecret  : twitterConfig.apisecret,
        callbackURL     : twitterConfig.callbackURL

    },
    function(token, tokenSecret, profile, done) {

        // make the code asynchronous
	// User.findOne won't fire until we have all our data back from Twitter
    	process.nextTick(function() {

	        /*User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

	       	 	// if there is an error, stop everything and return that
		        // ie an error connecting to the database
	            if (err)
	                return done(err);

				// if the user is found then log them in
	            if (user) {
	                return done(null, user); // user found, return that user
	            } else {
	                // if there is no user, create them
	                var newUser                 = new User();

					// set all of the user data that we need
	                newUser.twitter.id          = profile.id;
	                newUser.twitter.token       = token;
	                newUser.twitter.username = profile.username;
	                newUser.twitter.displayName = profile.displayName;
	                newUser.twitter.lastStatus = profile._json.status.text;

					// save our user into the database
	                newUser.save(function(err) {
	                    if (err)
	                        throw err;
	                    return done(null, newUser);
	                });
	            }
	        });*/
			
			var MongoClient = require('mongodb').MongoClient;
				var url = "mongodb+srv://guru:guru1998@cluster0-ptqa5.mongodb.net/FB";

				MongoClient.connect(url, function(err, db) 
				{
					if (err) throw err;
					var dbo = db.db("User");
				  
					dbo.collection("cust1").findOne({'owner_id' : profile.id}, function(err, user) 
					{
							if (err) throw err;
							if (user) 
							{
									return done(null, user); 
									
							} 
							else 
							{
											
									var myobj = { owner_id: profile.id, first: profile.username ,last:profile.displayName ,pwd:''};
									
									dbo.collection("users").insertOne(myobj, function(err, res) {
									if (err) throw err;
									console.log("1 document inserted");
									db.close();
									});
							}
							
					});
				});

		});

    }));

};