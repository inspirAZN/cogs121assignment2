// the formatted json
var friendGraph = {};
// var links = {};
// var nodes = {};

// width and height  of svg
var width = "100%";
var height = 1000;

// make an ajax request to get friend connections/data

	$.ajax({
			type: 'GET',
			url: '/fbgraph/friends',
			dataType: 'json'
		}).done( function(response) {
			// collect the response and format or d3
			console.log('getting friends');

			d3.json( response, function(error, json) {
				if (error) return console.warn(error);
				data = json;
			    visualizeit();
			});


			var friends = response.data.reduce(function(acc, person) {
				acc[person.id] = person.name;
				return acc;
			});

			var friend_id = Object.keys(friends);

			// map friends and their ids

			// nodes

			console.log('setting up nodes');
			friendGraph.nodes = friend_id.map(function(friend_id) {
				return {
					id: friend_id,
					name: friends[friend_id],
				}
			});

			// nodes = friend_id.map(function(friend_id) {
			// 	return {
			// 		id: friend_id,
			// 		name: friends[friend_id],
			// 	}
			// });

			// get mutual friends
			$.ajax({
				type: 'GET',
					url: '/fbgraph/mutualfriends',
					dataType: 'json'
				}).done( function(response) {
					// last ajax call
					console.log('getting mutual friends');

					// edges
					console.log('setting up edges');
					var calculatedWeight;

					friendGraph.edges = response.data.map(function(link) {

						return {
							source: friend_id.indexOf(link.uid1),
							target: friend_id.indexOf(link.uid2)
						}
					});
					// links = response.data.map(function(link) {
					// 	return {
					// 		source: friend_id.indexOf(link.uid1),
					// 		target: friend_id.indexOf(link.uid2)
					// 	}
					// });

					console.log('friendGraph complete');

					// do the force layout
					console.log('setting up force layout');
					// json is formatted. draw the graph with d3
					var force = d3.layout.force()
								.charge(-120)
								.linkDistance(30)
								.nodes(friendGraph.nodes)
								.links(friendGraph.edges)
								.size([width, height]);

					// svg container for the graph
					console.log('appending svg');
					var friendSVG = d3.select('#myGraph')
										.append('svg')
										.attr('width', width)
    									.attr('height', height);

					// edges for the graph
					console.log('putting edges on svg');
					var edges = friendSVG.selectAll('line.edge')
								.data(friendGraph.edges)
								.enter()
								.append('line')
								.attr('class', 'edge')
								.style('stroke', 'rgba(200, 200, 200, 0.2')
								.style('stroke-width', .6);			

					console.log('putting nodes on svg');
					var nodes = friendSVG.selectAll('circle.node')
								.data(friendGraph.nodes)
								.enter()
								.append('circle')
								.attr('class', 'node')
								.attr('r', 5)
								.style('fill', 'blue')
								.style('cursor', 'pointer')
								.call(force.drag);

					// set weights
					// console.log('trying to set weights');
					// edge.forEach(function(d) {
					// 	if(typeof d.source == "number") { d.source = node[d.source]; }
					// 	if(typeof d.target == "number") { d.target = node[d.target]; }
					// })
					// console.log(edge.data);
					friendGraph.edges[0].source = 0;
					console.log(friendGraph.edges[0]);
					console.log(friendGraph.nodes[0]);


					console.log('setting tick');
					force.on('tick', function() {
						nodes.attr('cx', function(d) { return d.x; })
							.attr('cy', function(d) { return d.y; });

						edges.attr('x1', function(d) { return d.source.x; })
							.attr('x2', function(d) { return d.target.x; })
							.attr('y1', function(d) { return d.source.y; })
							.attr('y2', function(d) { return d.target.y; });
					});
					// for(var i = 0; i < links.length; i++) {
					// 	if( links[i] == undefined ) {
					// 	console.log('node at ' + i + 'is undefined');
					// 	} else if(links[i].source == undefined ) {
					// 		console.log('node at ' + i + 'has source undefined');
					// 	}	
					// }
					
					// check for null sources
					var nullsrcs = 0;
					// friendGraph.nodes[0].source = 0;
					console.log("there are " + nullsrcs + " null sources");
					// console.log(friendGraph.nodes[0].source);
					console.log('starting...');
					force.start();
					console.log('done!');

				});
		});
