var auth = require('./auth');

//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var app = express();


//route files to load
var index = require('./routes/index');
var twit = require('./routes/twit');

//database setup - uncomment to set up your database
//var mongoose = require('mongoose');
//mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/DATABASE1);

//Configures the Template engine
app.engine('handlebars', handlebars( {
  partialsDir: __dirname + '/views/partials',
  layoutsDir: __dirname + '/views/layouts'
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: "josephdabess"}));
app.use(auth.passport.initialize());
app.use(auth.passport.session());
app.use(app.router);

//routes
app.get('/', index.view);

// twitter routes
app.get('/twit', twit.view);
app.post('/twit/search', twit.search);
// app.get('/twit/profile', twit.profile);
app.get('/twit/profile', function (req, res) {
	res.json(req.user.profile);
});

app.get('/authn/twitter', auth.passport.authenticate('twitter'));
// app.get('/twit/login', twit.login);
app.get('/authn/twitter/callback', 
  auth.passport.authenticate('twitter', { successRedirect: '/twit/profile',
                                     failureRedirect: '/failure' }));
app.get('/failure', twit.view);



//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});