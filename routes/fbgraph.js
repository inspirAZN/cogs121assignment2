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

// helper function
function getRandomInt(min, max) {
  	return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.getPic = function (req, res) {
	var photoArrayLength;
	var photoInformation = [];
	var temp = [];

	var commentsLength;
	var min = 0;
	var max;

	auth.graph.get("/me/photos", function(err, reply) {
		// get the length of the array
		photoArrayLength = reply.data.length;

		// generate a random number to randomly select a picture
		max = photoArrayLength - 1;
		var randomInt = getRandomInt(min, max);

		photoInformation = reply.data[randomInt];
		temp.pic = photoInformation.source;

		res.json(photoInformation.from.name);
	});

	// now have one photo from the array
	

}

exports.graphAPI = function (req, res) {
	auth.graph.get("/me/photos", function(err, json) {
		res.json(json); 
	});
}