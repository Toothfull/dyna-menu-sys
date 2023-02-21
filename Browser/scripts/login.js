//onload function
$(function() {
	// Check if user was not verified
	userStatus = getUrlVars()['notverified']

	if (userStatus == 'true') {
		// Show unverified message
		$('#notVerifiedWarning').show()
	}

})

//When login button clicked
$('#googleOAuth').click(function() {

	// Get OAuth link from route
	$.get('/oauthlink', function(url) {
		// Redirect to Google OAuth
		window.location.href = url
	})
	
})

// Read a page's GET URL variables and return them as an associative array.
function getUrlVars()
{
	var vars = [], hash
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')
	for(var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=')
		vars.push(hash[0])
		vars[hash[0]] = hash[1]
	}
	return vars
}