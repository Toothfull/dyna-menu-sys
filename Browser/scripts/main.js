//Stores whether the user is viewing markdown or html
let markdownOption = false


infoModal = new bootstrap.Modal($('#infoBox')); //info modal

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
				
				$('#infoTitle').text('Success!');	//display success message
				$('#infoContent').text('Document was uploaded successfully!');
				infoModal.show()

				pullLatestMenu();//update the menu
			},
			error: function(data) {
				console.log('menu update failed!\n' + data);

				$('#infoTitle').text('Failed');	//display failed message
				$('#infoContent').text('Document did not upload successfully!');
				infoModal.show()

			}
		});
	} catch (error) {
		console.log(error); //if error, log it

		$('#infoTitle').text('Failed');	//display failed message
		$('#infoContent').text('Menu upload failed!');
		infoModal.show()

	}
}

const nameModal = new bootstrap.Modal($('#documentNameBox'));

$('#documentNameSubmit').click(function() {
	documentName = $('#documentNameInput').val();
	nameModal.hide();
	if (documentName == '') {
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
		
		$('#infoTitle').text('Incorrect view');	//display incorrect message
		$('#infoContent').text('Please switch to HTML view to upload a document.');
		infoModal.show()

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

	// if in html view
	if ( markdownOption == true ) {
		$('#infoTitle').text('Incorrect view');	//display incorrect message
		$('#infoContent').text('Please switch to HTML view to view the latest document');
		infoModal.show()
		return 0; // exit function
	}

	pullLatestMenu();

	$('#infoTitle').text('Document pulled');	//display incorrect message
	$('#infoContent').text('Latest document was pulled from the database.');
	infoModal.show()
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

//When clicked any text found highlighted will be input markdown header
$('#insertHeading').click(function() {
	// if in markdown view
	if ( markdownOption == false ) {
		$('#infoTitle').text('Incorrect view');	//display incorrect message
		$('#infoContent').text('Please switch to Markdown view to insert a heading.');
		infoModal.show()
		return 0; // exit function
	}

	if ($( "#menuPre" )[ 0 ].selectionStart == $( "#menuPre" )[ 0 ].selectionEnd) {
		const cursorPosition = $( "#menuPre" )[ 0 ].selectionStart;
		// Gets the position from the start of the text to the cursor and adds the # to the end of it on the cursor position then re adds all the content back
		$('#menuPre').val( $('#menuPre').val().substring(0, cursorPosition) + '#' + $('#menuPre').val().substring(cursorPosition) ); 
	} else if ($( "#menuPre" )[ 0 ].selectionStart != $( "#menuPre" )[ 0 ].selectionEnd) {
		const cursorPosition = $( "#menuPre" )[ 0 ].selectionStart;
		const cursorEndPosition = $( "#menuPre" )[ 0 ].selectionEnd;
		// Gets the text from the highlighted text
		const highlightedText = $('#menuPre').val().substring(cursorPosition, cursorEndPosition);
		// Replaces the highlighted text with nothing
		$('#menuPre').val( $('#menuPre').val().substring(0, cursorPosition) + '' + $('#menuPre').val().substring(cursorEndPosition) );
		// Pastes the highlighted text back with the # at the start
		$('#menuPre').val( $('#menuPre').val().substring(0, cursorPosition) + `# ${highlightedText}` + $('#menuPre').val().substring(cursorPosition) );
	}
});

$('#insertLink').click(function() {
	// if in markdown view
	if ( markdownOption == false ) {
		$('#infoTitle').text('Incorrect view');	//display incorrect message
		$('#infoContent').text('Please switch to Markdown view to insert a link.');
		infoModal.show()
		return 0; // exit function
	}

	if ($( "#menuPre" )[ 0 ].selectionStart == $( "#menuPre" )[ 0 ].selectionEnd) {
		const cursorPosition = $( "#menuPre" )[ 0 ].selectionStart;
		// Gets the position from the start of the text to the cursor and adds the # to the end of it on the cursor position then re adds all the content back
		$('#menuPre').val( $('#menuPre').val().substring(0, cursorPosition) + '[ExampleText](http://www.example.com/)' + $('#menuPre').val().substring(cursorPosition) ); 
	} else if ($( "#menuPre" )[ 0 ].selectionStart != $( "#menuPre" )[ 0 ].selectionEnd) {
		const cursorPosition = $( "#menuPre" )[ 0 ].selectionStart;
		const cursorEndPosition = $( "#menuPre" )[ 0 ].selectionEnd;
		// Gets the text from the highlighted text
		const highlightedText = $('#menuPre').val().substring(cursorPosition, cursorEndPosition);
		// Replaces the highlighted text with nothing
		$('#menuPre').val( $('#menuPre').val().substring(0, cursorPosition) + '' + $('#menuPre').val().substring(cursorEndPosition) );
		// Pastes the highlighted text back with the # at the start
		$('#menuPre').val( $('#menuPre').val().substring(0, cursorPosition) + `[${highlightedText}](http://www.example.com/)` + $('#menuPre').val().substring(cursorPosition) );
	}
});

$('#insertUnorderedList').click(function() {
	// if in markdown view
	if ( markdownOption == false ) {
		$('#infoTitle').text('Incorrect view');	//display incorrect message
		$('#infoContent').text('Please switch to Markdown view to insert a unordered list.');
		infoModal.show()
		return 0; // exit function
	}

	if ($( "#menuPre" )[ 0 ].selectionStart == $( "#menuPre" )[ 0 ].selectionEnd) {
		const cursorPosition = $( "#menuPre" )[ 0 ].selectionStart;
		// Gets the position from the start of the text to the cursor and adds the a dummy to the end of it on the cursor position then re adds all the content back
		$('#menuPre').val( $('#menuPre').val().substring(0, cursorPosition) + '\n* Item 1 \n* Item 2 \n* Item 3 \n' + $('#menuPre').val().substring(cursorPosition) );
	} else if ($( "#menuPre" )[ 0 ].selectionStart != $( "#menuPre" )[ 0 ].selectionEnd) {
		const cursorPosition = $( "#menuPre" )[ 0 ].selectionStart;
		const cursorEndPosition = $( "#menuPre" )[ 0 ].selectionEnd;
		const highlightedText = $('#menuPre').val().substring(cursorPosition, cursorEndPosition);


		// adds a '1. to the start of each line
		const highlightedTextArray = highlightedText.split('\n'); // split the text into an array per line
		let highlightedTextArrayNew = []; // create a new array to store the new list
		for (let i = 0; i < highlightedTextArray.length; i++) { //loop till the end of the old array
			highlightedTextArrayNew.push('* ' + highlightedTextArray[i]); // add a '* ' to the start of each line
		}
		highlightedTextArrayNew = highlightedTextArrayNew.join('\n'); // join the array back into a string

		$('#menuPre').val( $('#menuPre').val().substring(0, cursorPosition) + '' + $('#menuPre').val().substring(cursorEndPosition) ); //remove all highlited content
		$('#menuPre').val( $('#menuPre').val().substring(0, cursorPosition) + highlightedTextArrayNew + $('#menuPre').val().substring(cursorPosition) ); // insert new list

	}
});

$('#insertOrderedList').click(function() {
	// if in markdown view
	if ( markdownOption == false ) {
		$('#infoTitle').text('Incorrect view');	//display incorrect message
		$('#infoContent').text('Please switch to Markdown view to insert a ordered list.');
		infoModal.show()
		return 0; // exit function
	}

	if ($( "#menuPre" )[ 0 ].selectionStart == $( "#menuPre" )[ 0 ].selectionEnd) {
		const cursorPosition = $( "#menuPre" )[ 0 ].selectionStart;
		// Gets the position from the start of the text to the cursor and adds the a dummy to the end of it on the cursor position then re adds all the content back
		$('#menuPre').val( $('#menuPre').val().substring(0, cursorPosition) + '\n1. Item 1 \n1. Item 2 \n1. Item 3 \n' + $('#menuPre').val().substring(cursorPosition) );
	} else if ($( "#menuPre" )[ 0 ].selectionStart != $( "#menuPre" )[ 0 ].selectionEnd) {
		const cursorPosition = $( "#menuPre" )[ 0 ].selectionStart;
		const cursorEndPosition = $( "#menuPre" )[ 0 ].selectionEnd;
		const highlightedText = $('#menuPre').val().substring(cursorPosition, cursorEndPosition);


		// adds a '1. to the start of each line
		const highlightedTextArray = highlightedText.split('\n'); // split the text into an array per line
		let highlightedTextArrayNew = []; // create a new array to store the new list
		for (let i = 0; i < highlightedTextArray.length; i++) { //loop till the end of the old array
			highlightedTextArrayNew.push('1. ' + highlightedTextArray[i]); // add a '* ' to the start of each line
		}
		highlightedTextArrayNew = highlightedTextArrayNew.join('\n'); // join the array back into a string

		$('#menuPre').val( $('#menuPre').val().substring(0, cursorPosition) + '' + $('#menuPre').val().substring(cursorEndPosition) ); //remove all highlited content
		$('#menuPre').val( $('#menuPre').val().substring(0, cursorPosition) + highlightedTextArrayNew + $('#menuPre').val().substring(cursorPosition) ); // insert new list
	}
});

$('#documentName').click(function() {
	// if in html view
	if ( markdownOption == true ) {
		$('#infoTitle').text('Incorrect view');	//display incorrect message
		$('#infoContent').text('Please switch to HTML view to change the name of the document.');
		infoModal.show()
		return 0; // exit function
	}

	documentNameModal = new bootstrap.Modal($('#newDocumentNameBox')); // Create new modal
	documentNameModal.show(); // Show modal when clicked
});

$('#newDocumentNameSubmit').click(function() {

	const documentName = $('#newDocumentNameInput').val();

	if (documentName == '') {
		$('#infoTitle').text('No name found');	//display no menu message
		$('#infoContent').text('Please enter a name for the menu.');
		infoModal.show()
	}
	
	if (documentName != '') {
		uploadMenuDocument(documentName, HTMLToMarkdown($('#menuView').html()));		
		$('#newDocumentNameInput').val('');
	}

}); 

deleteAllModal = new bootstrap.Modal($('#deleteAllBox')); // Create new modal

$('#deleteALLDocumentsClick').click(function() {
	deleteAllModal.show(); // Show modal when clicked
})

$('#deleteAllYes').click(function() { // if yess clicked delete all documents
	$.ajax({
		url: '/deletealldocuments',
		type: 'GET',
		success: function(result) {
			$('#infoTitle').text('All documents deleted');	//display no menu message
			$('#infoContent').text('All documents have been deleted.');
			infoModal.show()

			$('#documentName').text('default') // reset document name
			$('#documentTimeStamp').text('Upload file'); // reset document timestamp
			$('#menuView').html(''); // reset menu view
		}
	});
});

$('#deleteLastDocumentClick').click(function() {
	lastModal = new bootstrap.Modal($('#deleteLastBox')); // Create new modal
	lastModal.show(); // Show modal when clicked
});

$('#deleteLastYes').click(function() {
	$.ajax({
		url: '/deletelastdocument',
		type: 'GET',
		success: function(result) {
			$('#infoTitle').text('Last document deleted');	//display last menu message
			$('#infoContent').text('The last saved document has been deleted.');
			infoModal.show()

			pullLatestMenu(); // pull the latest menu from the database
		}
	});
});





$('#clickRed').click(function() {
	colourMarkdownInsert('#FF0000')
})
$('#clickOrange').click(function() {
	colourMarkdownInsert('#FFA500')

})
$('#clickYellow').click(function() {
	colourMarkdownInsert('#FFFF00')
})



$('#clickGreen').click(function() {
	colourMarkdownInsert('#008000')
})
$('#clickBlue').click(function() {
	colourMarkdownInsert('#0000FF')
})
$('#clickPurple').click(function() {
	colourMarkdownInsert('#800080')
})


$('#clickPink').click(function() {
	colourMarkdownInsert('#FFC0CB')
})
$('#clickBrown').click(function() {
	colourMarkdownInsert('#A52A2A')
})
$('#clickTan').click(function() {
	colourMarkdownInsert('#D2B48C')
})


$('#clickPlum').click(function() {
	colourMarkdownInsert('#DDA0DD')
})
$('#clickGrey').click(function() {
	colourMarkdownInsert('#808080')
})
$('#clickWhite').click(function() {
	colourMarkdownInsert('#FFFFFF')
})



pullModal = new bootstrap.Modal($('#pullBox')); // Create new modal
//disable modal from closing
pullModal._config.backdrop = 'static';
//Grab the latest menu from the database
function pullLatestMenu() {
	pullModal.show()
	$.getJSON('/latest', function(latestDocument) {

		if (latestDocument == null) {
				$('#infoTitle').text('No menu was found');	//display no menu message
				$('#infoContent').text('No menu was found on the database. Please edit the page below and upload a menu.');
				infoModal.show()
			return;
		}

		const fileLines = latestDocument.fileLines
		const timestamp = new Date (latestDocument.timestamp).toLocaleString();
		const fileName = latestDocument.fileName;
		
		//render the document, name of document and timestamp
		$('#documentTimeStamp').text('Uploaded ' + (timestamp));
		$('#documentName').text(fileName);

		$('#menuView').html(markdownToHTML(fileLines.join('\n')));
		pullModal.hide()
	});
}

function colourMarkdownInsert (colour){
		// if in markdown view
		if ( markdownOption == false ) {
			$('#infoTitle').text('Incorrect view');	//display incorrect message
			$('#infoContent').text('Please switch to Markdown view to insert a heading.');
			infoModal.show()
			return 0; // exit function
		}
	
		if ($( "#menuPre" )[ 0 ].selectionStart == $( "#menuPre" )[ 0 ].selectionEnd) {
			const cursorPosition = $( "#menuPre" )[ 0 ].selectionStart;
			// Gets the position from the start of the text to the cursor and adds the # to the end of it on the cursor position then re adds all the content back
			$('#menuPre').val( $('#menuPre').val().substring(0, cursorPosition) + `%${colour},TextGoesHere%` + $('#menuPre').val().substring(cursorPosition) ); 
		} else if ($( "#menuPre" )[ 0 ].selectionStart != $( "#menuPre" )[ 0 ].selectionEnd) {
			const cursorPosition = $( "#menuPre" )[ 0 ].selectionStart;
			const cursorEndPosition = $( "#menuPre" )[ 0 ].selectionEnd;
			// Gets the text from the highlighted text
			const highlightedText = $('#menuPre').val().substring(cursorPosition, cursorEndPosition);
			// Replaces the highlighted text with nothing
			$('#menuPre').val( $('#menuPre').val().substring(0, cursorPosition) + '' + $('#menuPre').val().substring(cursorEndPosition) );
			// Pastes the highlighted text back with the # at the start
			$('#menuPre').val( $('#menuPre').val().substring(0, cursorPosition) + `%${colour},${highlightedText}%` + $('#menuPre').val().substring(cursorPosition) );
		}
}
