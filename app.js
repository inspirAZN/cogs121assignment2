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
var fbgraph = require('./routes/fbgraph');

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

// facebook routes
app.get('/fbgraph', fbgraph.view);
app.get('/fbgraph/profile', fbgraph.profile);

// facebook authentication
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/fbgraph/profile',
                                      failureRedirect: '/failue' }));

// twitter routes
app.get('/twit', twit.view);
app.post('/twit/search', twit.search);
app.get('/twit/profile', twit.profile);
app.post('/twit/randTweets/:query', twit.randTweets);
app.get('/twit/json', function(req, res) {
	res.json(req.user);
})
// twitter authentication
app.get('/authn/twitter', auth.passport.authenticate('twitter'));
app.get('/authn/twitter/callback', 
  auth.passport.authenticate('twitter', { successRedirect: '/twit/profile',
                                     failureRedirect: '/failure' }));
app.get('/failure', index.view);



//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});