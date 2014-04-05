
/**
 * Module dependencies.
 */

var express = require('express');
var	routes = require('./routes/routes');
var	http = require('http');
var	path = require('path');
var	passport = require('passport');
var	Commons = require('./modules/security/commons.js');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commons = new Commons();
var app = express();

// all environments
app.set('port', process.env.PORT || 5005);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession({ secret: 'keyboard cat', cookie: {maxAge: 60 * 1000 * 60 * 24 * 7} }));
// app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

mongoose.connect('mongodb://localhost/hack4good');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {

	commons.setVar('db', db);
	commons.setVar('mongoose', mongoose);

	routes(app, commons, passport);
});


http.createServer(app).listen(app.get('port'), function(){
	console.log('Express User MGMT server listening on port ' + app.get('port'));
});
