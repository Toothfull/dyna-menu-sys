//Stores whether the user is viewing markdown or html
let markdownOption = false

//on load
$(function() {
	//get the user's google data
	$.getJSON('/session', function(data) {
		console.dir( data )

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

function uploadMenuDocument( documentName, documentText ) {
	try { //Try to upload document as json to route
		$.ajax({
			url: '/updatemenu',
			type: 'POST',
			data: JSON.stringify({
				markdown: documentText, //HTMLToMarkdown($('#menuView').html()),
				fileName: documentName
			}),
			contentType: 'application/json',
			success: function(data) {
				console.log('menu update successful!\n' + data);
				alert('Upload successful!')
				pullLatestMenu();
			},
			error: function(data) {
				console.log('menu update failed!\n' + data);
			}
		});
	} catch (error) {
		console.log(error); //if error, log it
		alert('Error uploading menu. Please try again later. If this error persists, please contact the developer.')
	}
}

const nameModal = new bootstrap.Modal($('#documentNameBox'));

$('#documentNameSubmit').click(function() {
	documentName = $('#documentNameInput').val();
	nameModal.hide();
	if (documentName == '') {
		alert('Please enter a name for the document');
		nameModal.show();
	} else {
		// try upload document as here
		uploadMenuDocument( documentName, HTMLToMarkdown($('#menuView').html()) );
	}
});

//Green upload button pressed
$('#uploadButton').click(function() {

	if (markdownOption == false) { //if in html view
		if ($('#documentName').text().trim() == 'default') {  //if the document name is default, ask for a new name
			nameModal.show();
		} else {
			const documentName = $('#documentName').text().trim();
			uploadMenuDocument( documentName, HTMLToMarkdown($('#menuView').html()) );
		}

	} else { //else in markdown view
		alert('Please switch to HTML view before uploading')
	}
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

$('#pullLatestClick').click(function() {
	pullLatestMenu();
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

		$('#mdConvert').attr('src', 'assets/images/markdownlogo.png');
		markdownOption = false
	} else { 
		// markdown to html
		const markdownText = HTMLToMarkdown($('#menuView').html());
		$('#menuPre').empty();
		$('#menuPre').val(markdownText);
		$('#menuPre').removeClass('visually-hidden');
		$('#menuView').addClass('visually-hidden');

		$('#mdConvert').attr('src', 'assets/images/htmlicon.png');
		markdownOption = true
	}

})

//Grab the latest menu from the database
function pullLatestMenu() {
	$.getJSON('/latest', function(latestDocument) {

		if (latestDocument == null) {
			alert('No menu found. Please upload a menu.')
			return;
		}

		const fileLines = latestDocument.fileLines
		const timestamp = new Date (latestDocument.timestamp).toLocaleString();
		const fileName = latestDocument.fileName;
		
		//render the document, name of document and timestamp
		$('#documentTimeStamp').text('Uploaded ' + (timestamp));
		$('#documentName').text(fileName);

		$('#menuView').html(markdownToHTML(fileLines.join('\n')));
	});
}
