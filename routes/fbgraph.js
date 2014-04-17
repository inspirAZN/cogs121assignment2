var auth = require('../auth');

exports.view = function (req, res) {
	res.render('fbgraph');
}

exports.profile = function (req, res) {
	var query = '/'
		query += req.user.profile.username;
		query += '/picture'
	res.render('fbgraphProfile', {
		userProfile: req.user.profile
	});
}