<script type="text/javascript">
		$(document).ready( function () {
			// global variable
			var solutionArray = [];
			var	solution = '';

			$('#randPicBtn').click(function (e) {

				e.preventDefault();

				$('#picResult').modal('show');

				// get a picture
				$.ajax({
					type: 'GET',
					url: '/fbgraph/randPic',
					dataType: 'json'
				}).done( function(response) {
					if (response.msg === '') {
						displayPic( response );
					} else {
						alert(response.msg);
					}
				});

				function displayPic( picJSON ) {
					// show the modal
					var picsource = '';
						picsource += picJSON.gameJSON.pic;

						solution += picJSON.gameJSON.solution;
						solution = solution.toLowerCase();

					solutionArray = solution.split(' ');

					var img = '<img id="dapic" src="';
						img += picsource;
						img += '" class="img-responsive img-rounded">';

					var caption = picJSON.gameJSON.subtitle;

					$('#load').remove();
					$('#pic-container').append(img);
					$('#subtitle').text(caption);
					$('#error').attr('href', picsource);
				}
			});

			$('#error').click(function (e) {
				// let's hack something that works
				e.preventDefault();

				var picsource = $(this).attr('href');
				window.open(picsource);
			});
			
			$('#getGuess').click(function (e) {
				// get the guess from input
				var guess = $('#guess').val().toLowerCase();
				var guessArray = guess.split(' ');
				var correct = false;

				if (guessArray.length > 1) {
					for( var i = 0; i < solutionArray.length; i++ ){
						// check if the user put in one or any of the answer
						for (var j = 0; j <= guessArray.length; j++) {
							if(solutionArray[i] === guessArray[j]) {
								correct = true;
								break;
							}
						}
					}
				} else {
					for( var i = 0; i < solutionArray.length; i++ ){
						// check if the user put in one or any of the answer
						console.log(solutionArray[i]);
						console.log(guessArray[i]);
						if(solutionArray[i] === guessArray[0]) {
							correct = true;
							break;
						}
					}
				}

				// if it's correct display correct
				if(correct) {
					$('#success').text('Correct! Refresh the page to try another picture.');
					$('#answer').text(solution);
					$('#incorrect').text('');
				} else {
					// it's wrong, display wrong
					$('#incorrect').text('Wrong Answer! Guess again or refresh try a new picture.');
				}

			});

			// remove the picture when the modal closes
			$('#picResult').on('hidden.bs.modal', function (e) {
				// reset everything in the modal
				$('#dapic').remove();
				$('#subtitle').text('');
				$('#incorrect').text('');
				$('#answer').text('');
			});	
		});
		
	</script>