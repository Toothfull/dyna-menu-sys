$('#googleOAuth').click(function() {

	$.get('/oauthlink', function(url) {
		// Redirect to Google OAuth
		window.location.href = url;
	});
	
});

//on load
$(function() {
	//get the user's name
	$.get('/session', function(data) {
		console.log(data);
	});
});