//load environment variables
var dotenv = require('dotenv');
dotenv.load();

var graph = require('fbgraph');

// Twitter login
var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
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
    console.log(user);
    done(null, user);
  }
));

exports.passport = passport;

var Twit = require('twit');

var T = new Twit({
    consumer_key:         process.env.twitter_consumer_key
  , consumer_secret:      process.env.twitter_consumer_secret
  , access_token:         process.env.twitter_token
  , access_token_secret:  process.env.twitter_token_secret
})

exports.T = T;


// facebook


