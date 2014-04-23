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
			active: true,
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
	var photoInformation = {};
	var temp = {};

	var commentsLength;
	var min = 0;
	var max;
	var msg = '';

	auth.graph.get("/me/photos", function(err, reply) {
		// get the length of the array
		photoArrayLength = reply.data.length;

		// generate a random number to randomly select a picture
		max = photoArrayLength - 1;
		var randomInt = getRandomInt(min, max);

		photoInformation = reply.data[randomInt];
		temp.pic = photoInformation.source;
		temp.solution = photoInformation.from.name;
		temp.subtitle = photoInformation.name;

		if(err) {
			msg = 'Sorry, there was an error. Try again.';
		}
		res.send({
			gameJSON: temp,
			msg: msg
		});
	});

	// now have one photo from the array
	

}

exports.graphAPI = function (req, res) {
	auth.graph.get("/me/photos", function(err, json) {
		res.json(json); 
	});
}

exports.getFriends = function(req, res) {
	// build/ format json for d3 implementation
	var friendGraph = {};
	
	var query = "SELECT uid1, uid2 FROM friend WHERE uid1 in (SELECT uid2 FROM friend WHERE uid1=me())";
		query += " AND uid2 IN (SELECT uid2 FROM friend WHERE uid1=me())";
	
	// get friends and reduce
	auth.graph.get("/me/friends", function(err, json) {
		var friends = json.data.reduce(function(acc, person) {
			acc[person.id] = person.name;
			return acc;
		});

		var friend_id = Object.keys(friends);

		// map friends and their ids
		friendGraph.nodes = friend_id.map(function(friend_id) {
			return {
				id: friend_id,
				name: friends[friendGraph]
			}
		});

	});

	// map mutual friends
	auth.graph.fql(query, function(err, json) {
		friendGraph.edges = json.data.map(function(link) {
			return {
				source: friend_id.indexOf(link.uid1),
				target: friend_id.indexOf(link.uid2)
			}
		});
	});

	res.send(friendGraph);
}