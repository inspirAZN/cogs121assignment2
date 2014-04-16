var auth = require('../auth');

exports.view = function (req, res) {
	res.render('twit');
}

exports.search = function (req, res) {
		auth.T.get('search/tweets', { q: req.body.tweet, count: 10 }, function(err, reply) {
		var tweetInfo = [];
		var status;

		console.log(req.body.tweet);

	    if (err) {
	        console.dir(err);
	    } else {
	        for (var i = 0; i < reply.statuses.length; i++) {
	            status = reply.statuses[i];
	            var tempJSON = {};

	            tempJSON.username = status.user.name;
	            tempJSON.tweet = status.text;
	            tempJSON.time = status.created_at;

	            tweetInfo.push(tempJSON);
	        }
	    }
		res.render('twitSearch', {
			tweet: tweetInfo,
			query: req.body.tweet
		});
	});
}

exports.profile = function(req, res) {
	var profilepic = req.user.profile.photos.value;
	res.render('twitProfile', { userProfile: req.user.profile,
								profilepic: profilepic });
}

exports.randTweets = function (req, res) {
		auth.T.get('search/tweets', { q: req.params.query , count: 10 }, function(err, reply) {
		var tweetInfo = [];
		var status;
		var searchCount = 0;
		var msg = '';

		console.log(req.params.query);

	    if (err) {
	        console.dir(err);
	    } else {
	        for (var i = 0; i < reply.statuses.length; i++) {
	            searchCount++;
	            status = reply.statuses[i];
	            var tempJSON = {};

	            tempJSON.username = status.user.name;
	            tempJSON.tweet = status.text;
	            tempJSON.time = status.created_at;

	            tweetInfo.push(tempJSON);
	        }
	    }

	    if ( searchCount == 0 ) {
	    	msg = 'No results for ';
	    	msg += req.params.query;
	    }
		res.send( {
			tweet: tweetInfo,
			query: req.params.query,
			msg: msg
		});
	});
}