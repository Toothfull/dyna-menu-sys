//Grab the latest menu from the database
function pullLatestMenu() {
	pullModal.show()
	$.getJSON('/latest', function(latestDocument) {

		if (latestDocument == null) {
			$('#infoTitle').text('No menu was found')	//display no menu message
			$('#infoContent').text('No menu was found on the database. Please edit the page below and upload a menu.')
			pullModal.hide()
			infoModal.show()
			return
		}

		const fileLines = latestDocument.fileLines
		const timestamp = new Date (latestDocument.timestamp).toLocaleString()
		const fileName = latestDocument.fileName
		
		//render the document, name of document and timestamp
		$('#documentTimeStamp').text('Uploaded ' + (timestamp))
		$('#documentName').text(fileName)

		$('#menuView').html(markdownToHTML(fileLines.join('\n')))
		pullModal.hide()
	})
}

function colourMarkdownInsert (colour){
	// if in markdown view
	if ( markdownOption == false ) {
		$('#infoTitle').text('Incorrect view')	//display incorrect message
		$('#infoContent').text('Please switch to Markdown view to insert a heading.')
		infoModal.show()
		return 0 // exit function
	}
	
	if ($( '#menuPre' )[ 0 ].selectionStart == $( '#menuPre' )[ 0 ].selectionEnd) {
		const cursorPosition = $( '#menuPre' )[ 0 ].selectionStart
		// Gets the position from the start of the text to the cursor and adds the # to the end of it on the cursor position then re adds all the content back
		$('#menuPre').val( $('#menuPre').val().substring(0, cursorPosition) + `{${colour},TextGoesHere}` + $('#menuPre').val().substring(cursorPosition) ) 
	} else if ($( '#menuPre' )[ 0 ].selectionStart != $( '#menuPre' )[ 0 ].selectionEnd) {
		const cursorPosition = $( '#menuPre' )[ 0 ].selectionStart
		const cursorEndPosition = $( '#menuPre' )[ 0 ].selectionEnd
		// Gets the text from the highlighted text
		const highlightedText = $('#menuPre').val().substring(cursorPosition, cursorEndPosition)
		// Replaces the highlighted text with nothing
		$('#menuPre').val( $('#menuPre').val().substring(0, cursorPosition) + '' + $('#menuPre').val().substring(cursorEndPosition) )
		// Pastes the highlighted text back with the # at the start
		$('#menuPre').val( $('#menuPre').val().substring(0, cursorPosition) + `{${colour},${highlightedText}}` + $('#menuPre').val().substring(cursorPosition) )
	}
}

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
				console.log('menu update successful!\n' + data)
				
				$('#infoTitle').text('Success!')	//display success message
				$('#infoContent').text('Document was uploaded successfully!')
				infoModal.show()

				pullLatestMenu()//update the menu
			},
			error: function(data) {
				console.log('menu update failed!\n' + data)

				$('#infoTitle').text('Failed')	//display failed message
				$('#infoContent').text('Document did not upload successfully!')
				infoModal.show()

			}
		})
	} catch (error) {
		console.log(error) //if error, log it

		$('#infoTitle').text('Failed')	//display failed message
		$('#infoContent').text('Menu upload failed!')
		infoModal.show()

	}
}