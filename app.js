var express = require('express');
var app = express();
var empty = require('is-empty');
var session = require('express-session');
var flash=require('connect-flash');
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb+srv://guru:guru1998@cluster0-ptqa5.mongodb.net/User";


var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// index.html
app.use(express.static('public'));
app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "/public/index.html" );
})
// register.html

app.get('/register', function (req, res) {

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
		    	

					dbo.collection("cust").insertOne(myobj, function(err, res) {
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
})

//login.html

app.get('/login', function (req, res) {
	
        MongoClient.connect(uri, function(err, db) {
  if (err)  console.log(err);
  var dbo = db.db("User");
  var query = { owner_id: req.query.email };
  dbo.collection("cust").find(query).toArray(function(err, result) {
  
	
	if(result[0].pwd != req.query.pwd)
	{
			res.send("<script>alert('You are not logged in'); window.location='http://127.0.0.1:8081/';</script>");
		
		
		
	} 
	else{
		res.sendFile( __dirname + "/public/dashboard.html" );
	}
	
	
	
	//sssconsole.log(result[0].pwd);
	
    
  });
}); 
		
})



app.get('/reset', function (req, res) {
   
var rn = require('random-number');
var options = {
  min:  1000
, max:  2500000
, integer: true
}
   
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
		dbo.collection("cust").updateOne(myquery, newvalues, function(err, res) {
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
  

   
})
 

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)

})