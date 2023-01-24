//on load
$(function() {
	//get the user's name
	$.get('/session', function(data) {

		if (data.id == null) {
			window.location.href = 'login.html';
		}
		else {
			$('#profileImage').attr('src', data.pictureLink);
		}
	});
});