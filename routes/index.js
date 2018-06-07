 express = require('express');
var router = express.Router();
var empty = require('is-empty');
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb+srv://guru:guru1998@cluster0-ptqa5.mongodb.net/User";
var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

	/* GET login page. */
	router.post('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('./index.html');
	});

	/* Handle Login POST */
	router.get('/login', function(req, res) {
			console.log("Success");
	    	 MongoClient.connect(uri, function(err, db) {
  if (err)  console.log(err);
  var dbo = db.db("User");
  var query = { owner_id: req.query.email };
  dbo.collection("cust1").find(query).toArray(function(err, result) {
  
	console.log(result);
	if(result[0].pwd != req.query.pwd)
	{
			res.send("<script>alert('You are not logged in'); window.location='http://127.0.0.1:8081/';</script>");
		
		
		
	} 
	else{
		res.send("<script>window.location='http://127.0.0.1:8081/dashboard.html';</script>");
	}
	
  });
}); 

		    	

	});

	/* GET Registration Page */
	router.get('/register', function(req, res){
		   MongoClient.connect(uri, function(err, db) {
	if(err)
	{
	 console.log(err);
	}
	if(db!=null)
	{
		 var dbo = db.db("User");
		 var myobj = { first: req.query.first, last: req.query.last, owner_id: req.query.email, pwd: req.query.pwd1};
		 var pass=req.query.pwd1
		 var cpass=req.query.pwd2;
		 
		 
		 
		if(pass==cpass)
		{
		    	

					dbo.collection("cust1").insertOne(myobj, function(err, res) {
					if (err) console.log(err);	
					console.log("User Created");	
					});
				
					res.send("<script>alert('Registered successfully'); window.location='http://127.0.0.1:8081/';</script>");		

		}
		
		else
		{	
		res.send("<script>alert('Password not same'); window.location='http://127.0.0.1:8081/register.html';</script>");
		}
  
	}
	
   db.close();
});
		

		
	});

	

	/* GET Home Page */
	router.get('/reset', function(req, res){
		var rn = require('random-number');
var options = {
  min:  1000
, max:  2500000
, integer: true
}
   var query = { owner_id: req.query.email };
   var nodemailer = require('nodemailer'); 
   
   var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gurunarayanancse@gmail.com',
    pass: 'guru1998@tce'
  }
});
randomValue=rn(options);

 
MongoClient.connect(uri, function(err, db) {
  if (err) throw err;
  var dbo = db.db("User");

  dbo.collection("cust").find(query).toArray(function(err, result) {
	if(empty(result))
	{
			res.send("<script>alert('Sorry You are not a registered User'); window.location='http://127.0.0.1:8081/forgot-password.html';</script>");
	} 
	else
	{
		
		 var myquery = { owner_id: req.query.email };
		var newvalues = { $set: {pwd: randomValue } };
		dbo.collection("cust1").updateOne(myquery, newvalues, function(err, res) {
		if (err) throw err;
		console.log("1 document updated");
    db.close();
  });
		
		var mailOptions = {
		  from: 'gurunarayanancse@gmail.com',
		  to: req.query.email,
		  subject: 'Password Reset',
		  text: 'Your Password is : ' + randomValue 
		};

		transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
			console.log(error);
		  } else {
			res.send("<script>alert('Mail sent'); window.location='http://127.0.0.1:8081/';</script>");
		  }
		}); 

		
	}

  });
}); 
	});

	
	
	// route for facebook authentication and login
	// different scopes while logging in
	router.get('/login/facebook', 
		passport.authenticate('facebook', { scope : 'email' }
	));

	// handle the callback after facebook has authenticated the user
	router.get('/login/twitter/callback',function(req, res){
		res.send("<script> window.location='http://127.0.0.1:8081/dashboard.html';</script>");
	});

	// route for twitter authentication and login
	// different scopes while logging in
	router.get('/login/twitter', 
		passport.authenticate('twitter'));

	// handle the callback after facebook has authenticated the user
	router.get('/login/facebook/callback',function(req, res){
		res.send("<script> window.location='http://127.0.0.1:8081/dashboard.html';</script>");
	});
	
	
	router.get('/login/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
		
router.get('/login/google/callback',function(req, res){
		res.send("<script> window.location='http://127.0.0.1:8081/dashboard.html';</script>");
	});
	/* GET Twitter View Page */
	router.get('/twitter', isAuthenticated, function(req, res){
		res.render('twitter', { user: req.user });z
	});

	return router;
}