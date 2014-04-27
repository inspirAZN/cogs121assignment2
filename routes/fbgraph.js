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

exports.getDemographics = function (req, res) {
	var demoJSON = {};
	var numMale = 0;	
	var numFemale = 0;
	var numSingle = 0;
	var numRelation = 0;
	var numMarried = 0;
	var numUnknown = 0;
	var query = "SELECT uid, name, relationship_status FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1=me())";
	// get the friends
	auth.graph.get('/me/friends?fields=gender', function(err, json) {
		// loop throuh the json
		for( var i = 0; i < json.data.length; i++) {
			// calculate num male
			if( json.data[i].gender == 'male' ) {
				numMale++;
			}
			// calculate num female
			else if( json.data[i].gender == 'female' ) {
				numFemale++;
			}
		}

	});
	
	auth.graph.fql(query, function(err, json) {
		// loop through and count relations
		for( var i = 0;i < json.data.length; i++) {
			// calculate 
			if( json.data[i].relationship_status == 'In a relationship') {
				numRelation++;
			} else if( json.data[i].relationship_status == 'Single' ) {
				numSingle++;
			} else if( json.data[i].relationship_status == 'Married' ){
				numMarried++;
			} else {
				numUnknown++;
			}
		}
	})
	
	// save to demographic json
		demoJSON.male = numMale;
		demoJSON.female = numFemale;
		demoJSON.single = numSingle;
		demoJSON.relationship = numRelation;
		demoJSON.married = numMarried;
		demoJSON.unknonw = numUnknown;


	// send demographic json
		res.send(demoJSON);

}

exports.getRelations = function(req, res) {

}


exports.getFriends = function(req, res) {	
	// get friends and reduce
	auth.graph.get("/me/friends", function(err, json) {
		res.send(json);
	});
}

exports.getMutualFriends = function(req, res) {
	var query = "SELECT uid1, uid2 FROM friend WHERE uid1 IN (SELECT uid2 FROM friend WHERE uid1=me())";
		query += " AND uid2 IN (SELECT uid2 FROM friend WHERE uid1=me())";

	// map mutual friends
	auth.graph.fql(query, function(err, json) {
		res.send(json);
	});
}