//load environment variables
var dotenv = require('dotenv');
dotenv.load();

var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
  , user = {};

passport.use(new TwitterStrategy({
    consumerKey: process.env.twitter_consumer_key,
    consumerSecret: process.env.twitter_consumer_secret,
    callbackURL: "http://jcalassignment1.herokuapp.com/authn/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    user.token = token;
    user.tokenSecret = tokenSecret;
    user.profile = profile;
    done();
  }
));

exports.passport = passport;

// var cofig = { };

// config.rootUrl = process.env.ROOT_URL;
// config.facebook = {
// 	appID: process.env.fb_id
// 	appSecret: process.env.fb_secret
// 	appNamespace: process.env.FACEBOOK_APPNAMESPACE
// 	redirect_uri: process.env.FACEBOOK_REDIRECTURI
// }

// module.exports = config;
/**
* Add your authentication apis here with example like the bottom
*/
/**
//add instagram api setup
var ig = require('instagram-node-lib');
ig.set('client_id', process.env.instagram_client_id);
ig.set('client_secret', process.env.instagram_client_secret);

//export ig as a parameter to be used by other methods that require it.
exports.ig = ig;
**/

// var graph = require('fbgraph');

// // get authorization url
//     var authUrl = graph.getOauthUrl({
//         "client_id":     conf.client_id
//       , "redirect_uri":  conf.redirect_uri
//     });

var Twit = require('twit');

var T = new Twit({
    consumer_key:         process.env.twitter_consumer_key
  , consumer_secret:      process.env.twitter_consumer_secret
  , access_token:         process.env.twitter_token
  , access_token_secret:  process.env.twitter_token_secret
})

exports.T = T;
