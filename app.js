var auth = require('./auth');

//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var app = express();

//route files to load
var index = require('./routes/index');
// var twit = require('./routes/twit');
var fbgraph = require('./routes/fbgraph');
var fs = require('fs');

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
app.get('/d3test', function(req, res) {
	res.render('testD3');
});

app.post('/', function(req, res) {
	res.json('YES');
});

// facebook routes
app.get('/fbgraph', fbgraph.view);
app.get('/fbgraph/profile', fbgraph.profile);
app.get('/fbgraph/randPic', fbgraph.getPic)
app.get('/fbgraph/testAPI', fbgraph.graphAPI);
app.get('/fbgraph/json', function(req, res) {
	res.json(req.user);
});
app.get('/fbgraph/friends', fbgraph.getFriends);
app.get('/fbgraph/mutualfriends', fbgraph.getMutualFriends);

// facebook authentication
// main login
app.get('/authn/facebook', auth.passport.authenticate('facebook', { scope: ['read_stream', 
			                                      	   		   'publish_actions', 
			                                      	   		   'user_birthday',
			                                      	   		   'friends_birthday',
			                                      	   		   'user_photos',
			                                      	   		   'friends_photos',
			                                      	   		   'user_status',
			                                      	   		   'user_about_me'			                                      	   		   
			                                      	   		   ]}));
app.get('/authn/facebook/callback', 
  auth.passport.authenticate('facebook', { successRedirect: '/fbgraph/profile',
                                      	   failureRedirect: '/failue',
                                      	  }));

// facebook canvas
// app.get('/auth/facebook', auth.passport.authenticate('facebook-canvas', { scope: ['read_stream', 
// 			                                      	   		   'publish_actions', 
// 			                                      	   		   'user_birthday',
// 			                                      	   		   'friends_birthday',
// 			                                      	   		   'user_photos',
// 			                                      	   		   'friends_photos',
// 			                                      	   		   'user_status',
// 			                                      	   		   'user_about_me'			                                      	   		   
// 			                                      	   		   ]}));

// app.post('/auth/facebook/callback', 
//   auth.passport.authenticate('facebook-canvas', { successRedirect: '/fbgraph/profile',
//                                              failureRedirect: '/error' }));
// app.post('/auth/facebook/canvas', 
//   auth.passport.authenticate('facebook-canvas', { successRedirect: '/success',
//                                              failureRedirect: '/auth/facebook/canvas/autologin' }));
// app.get('/auth/facebook/canvas/autologin', function( req, res ){
//   res.send( '<!DOCTYPE html>' +
//               '<body>' +
//                 '<script type="text/javascript">' +
//                   'top.location.href = "/auth/facebook";' +
//                 '</script>' +
//               '</body>' +
//             '</html>' );
// });


// twitter routes
// app.get('/twit', twit.view);
// app.post('/twit/search', twit.search);
// app.get('/twit/profile', twit.profile);
// app.post('/twit/randTweets/:query', twit.randTweets);
// app.get('/twit/json', function(req, res) {
// 	res.json(req.user);
// });
// // twitter authentication
// app.get('/authn/twitter', auth.passport.authenticate('twitter'));
// app.get('/authn/twitter/callback', 
//   auth.passport.authenticate('twitter', { successRedirect: '/twit/profile',
//                                      failureRedirect: '/failure' }));
// app.get('/failure', index.view);


// var certificate = {
//   key: fs.readFileSync(path.resolve(__dirname, './self_signed_ssl.key'), 'utf8'),
//   cert: fs.readFileSync(path.resolve(__dirname, './self_signed_ssl.crt'), 'utf8')
// }


//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});