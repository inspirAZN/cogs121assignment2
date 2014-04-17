var auth = require('../auth');

exports.view = function (req, res) {
	res.render('fbgraph');
}

exports.profile = function (req, res) {
	var query = '/';
		query += req.user.profile.username;
		query += '/picture';
	auth.graph.get(query, function(err, json) {
		res.render('fbgraphProfile', {
			userProfile: req.user.profile,
			profPic: json.location
		});
	});
	// res.render('fbgraphProfile', {
	// 	userProfile: req.user.profile
	// });
}

exports.graphAPI = function (req, res) {
	auth.graph.get("/joseph.caluza/photos", function(err, json) {
		res.json(json);
	});
}