var auth = require('../auth');

exports.view = function (req, res) {
	res.render('fbgraph');
}

exports.profile = function (req, res) {
	var query = '/';
		query += req.user.profile.username;
		query += '/picture';

	var queryMe = '/me';

	auth.graph.get(query, function(err, json) {
		res.render('fbgraphProfile', {
			userProfile: req.user.profile,
			profPic: json.location
		});
	});
}

exports.graphAPI = function (req, res) {
	var query = {
	    name:         "SELECT name FROM user WHERE uid = me()"
	  , permissions:  "SELECT email, user_about_me, user_birthday FROM permissions WHERE uid = me()"
	};

	auth.graph.fql(query, function(err, json) {
		res.json(json);
	});
	// auth.graph.fql("/me/photos", function(err, json) {
	// 	res.json(json);
	// });
}