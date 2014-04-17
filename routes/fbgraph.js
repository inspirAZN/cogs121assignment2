var auth = require('../auth');

exports.view = function (req, res) {
	res.render('fbgraph');
}

exports.profile = function (req, res) {
	res.render('fbgraphProfile');
}