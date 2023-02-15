//Stores whether the user is viewing markdown or html
let markdownOption = false

//on load
$(function() {
	//get the user's google data
	$.get('/session', function(data) {

		//if the user is not logged in, redirect to login page
		if (data.id == null) {
			window.location.href = 'login.html';
		}
		else { //if the user is logged in, display their profile picture
			$('#profileImage').attr('src', data.pictureLink);
		}
	});

	//get the latest menu from the database
	pullLatestMenu();
});

//When the user clicks the timestamp, open the file explorer and upload document
$('#documentTimeStamp').click(function() {
	console.log('Selecting document')
	//Press hidden input box
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

//Green upload button pressed
$('#uploadButton').click(function() {

});

//About tab pressed
$('#aboutClick').click(function() {
	let myModal = new bootstrap.Modal($('#aboutBox'))
	$('#aboutTitle').text('About');
	$('#aboutDescription').text('This is a web application that takes markdown and will convert it to HTML. This is then uploaded to a database which android devices will render the latest menu.');
	myModal.show();
});

//About tab pressed
$('#cheatClick').click(function() {
	$('#cheatTitle').text('Markdown Cheat Sheet');
	let myModal = new bootstrap.Modal($('#cheatBox'))
	myModal.show();
});

//Logout button pressed
$('#logOutClick').click(function() {
	$.get('/logout', function(data) {
		window.location.href = data;
		console.log('Logging out');
	});
});


//Render either html or markdown
$('#mdConvert').click(function() {

	if ( markdownOption == true ) {
		// html to markdown
		const htmlText = markdownToHTML($('#menuPre').val());
		$('#menuView').empty();
		$('#menuView').html(htmlText);
		$('#menuView').removeClass('visually-hidden');
		$('#menuPre').addClass('visually-hidden');
		markdownOption = false
	} else { 
		// markdown to html
		const markdownText = HTMLToMarkdown($('#menuView').html());
		$('#menuPre').empty();
		$('#menuPre').val(markdownText);
		$('#menuPre').removeClass('visually-hidden');
		$('#menuView').addClass('visually-hidden');
		markdownOption = true
	}

})

//Grab the latest menu from the database
function pullLatestMenu() {
	$.getJSON('/latest', function(latestDocument) {
		const fileLines = latestDocument.fileLines
		const timestamp = new Date (latestDocument.timestamp).toLocaleString();
		const fileName = latestDocument.fileName;
		
		//render the document, name of document and timestamp
		$('#documentTimeStamp').text('Uploaded ' + (timestamp));
		$('#documentName').text(fileName);

		$('#menuView').html(markdownToHTML(fileLines.join('\n')));
	});
}