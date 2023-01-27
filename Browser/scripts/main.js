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

$('#uploadDocument').click(function() {
	console.log('Selecting document')
	$('#uploadFile').click();	
});

$('#uploadFile').change(function() {
	console.log('Uploading document')

	// get the file we selected
	var file = this.files[0];

	// create a new form data object to hold our file for sending to the server
	var formData = new FormData();
	formData.append('file', file);

	// send the file to the server
	$.ajax({
		url: '/upload',
		type: 'PUT',
		data: formData,
		processData: false,
		contentType: false,
		success: function(data) {
			console.log('upload successful!\n' + data);
		},
		error: function(data) {
			console.log('upload failed!\n' + data);
		}
	});

});

$('#uploadButton').click(function() {
	$.getJSON('/latest', function(latestDocument) {
		const latestMenu = latestDocument.latestMenu
		console.log(latestMenu)

		$('#menuView').empty();
		
		for (let i = 0; i < latestMenu.length; i++) {
			const line = latestMenu[i];

			$('#menuView').append('<p>' + line + '</p>');
		}
	});

});
