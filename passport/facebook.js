var FacebookStrategy = require('passport-facebook').Strategy;

var fbConfig = require('../fb.js');

module.exports = function(passport) {

    passport.use('facebook', new FacebookStrategy({
        clientID        : fbConfig.appID,
        clientSecret    : fbConfig.appSecret,
        callbackURL     : fbConfig.callbackUrl
    },

    // facebook will send back the tokens and profile
    function(access_token, refresh_token, profile, done) {

    	console.log('profile', profile);

		// asynchronous
		process.nextTick(function() {
		
		//********************************************
		
		
		
				var MongoClient = require('mongodb').MongoClient;
				var url = "mongodb+srv://guru:guru1998@cluster0-ptqa5.mongodb.net/FB";

				MongoClient.connect(url, function(err, db) 
				{
					if (err) throw err;
					var dbo = db.db("FB");
				  
					dbo.collection("users").findOne({'author_id' : profile.id}, function(err, user) 
					{
							if (err) throw err;
							if (user) 
							{
									return done(null, user); 
									
							} 
							else 
							{
											
									var myobj = { author_id: profile.id, first: profile.name.givenName,last:profile.name.familyName ,email: profile.emails[0].value ,token: access_token};
									
									dbo.collection("users").insertOne(myobj, function(err, res) {
									if (err) throw err;
									console.log("1 document inserted");
									db.close();
									});
							}
							
					});
				});
		
	
		//********************************************
			
        });

    }));

};
