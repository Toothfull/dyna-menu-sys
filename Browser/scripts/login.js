//When login button clicked
$('#googleOAuth').click(function() {

	// Get OAuth link from route
	$.get('/oauthlink', function(url) {
		// Redirect to Google OAuth
		window.location.href = url;
	});
	
});