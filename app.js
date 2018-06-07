var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport');
var bodyParser = require('body-parser');
var empty = require('is-empty');

//DB
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb+srv://guru:guru1998@cluster0-ptqa5.mongodb.net/User";
//Start Express
var app = express();

app.set('views', __dirname + '\\public'); // general config
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

app.use(favicon());
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({secret: 'oWJVt4As6qVpWuhvgmHhWmQ62sF6LEbbZc1tjHwCSVH5rqPDgB'}));
app.use(passport.initialize());
app.use(passport.session());

var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);


var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)

})


module.exports = app;




