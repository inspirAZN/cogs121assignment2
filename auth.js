//load environment variables
var dotenv = require('dotenv');
dotenv.load();

// used for oauth
var passport = require('passport');


/* --------------
 * FACEBOOK STUFF 
 * -------------- */
var graph = require('fbgraph');

// facebook login
var FacebookStrategy = require('passport-facebook').Strategy
    , user = {};

passport.use(new FacebookStrategy({
    clientID: process.env.fb_id,
    clientSecret: process.env.fb_secret,
    callbackURL: "http://jcalassignment1.herokuapp.com/authn/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    user.token = accessToken;
    user.refreshToken = refreshToken;
    user.profile = profile;

    graph.setAccessToken(user.token);

    done(null, user);
  }
));

/* -------------
 *  CANVAS
 * ------------- */

var FacebookCanvasStrategy = require('passport-facebook-canvas');

passport.use(new FacebookCanvasStrategy({
    clientID: process.env.fb_id,
    clientSecret: process.env.fb_secret,
    callbackURL: "https://apps.facebook.com/jcaluza_cg_hw_one/authz/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    user.token = accessToken;
    user.refreshToken = refreshToken;
    user.profile = profile;

    graph.setAccessToken(user.token);

    done(null, user);
  }
));

/* --------------
 * Twitter STUFF 
 * -------------- */
// Twitter login
var TwitterStrategy = require('passport-twitter').Strategy
  , user = {};

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new TwitterStrategy({
    consumerKey: process.env.twitter_consumer_key,
    consumerSecret: process.env.twitter_consumer_secret,
    callbackURL: "http://jcalassignment1.herokuapp.com/authn/twitter/callback"
    // callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"

  },
  function(token, tokenSecret, profile, done) {
    user.token = token;
    user.tokenSecret = tokenSecret;
    user.profile = profile;
    done(null, user);
  }
));

// twit node module
var Twit = require('twit');

var T = new Twit({
    consumer_key:         process.env.twitter_consumer_key
  , consumer_secret:      process.env.twitter_consumer_secret
  , access_token:         process.env.twitter_token
  , access_token_secret:  process.env.twitter_token_secret
})


/* ---------
 * EXPORTS
 * --------- */
exports.passport = passport;
exports.T = T;
exports.graph = graph;





