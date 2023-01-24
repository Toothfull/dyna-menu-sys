$('#googleOAuth').click(function() {

	$.get('/oauthlink', function(url) {
		// Redirect to Google OAuth
		window.location.href = url;
	});
	
});