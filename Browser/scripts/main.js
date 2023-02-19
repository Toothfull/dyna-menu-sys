//Stores whether the user is viewing markdown or html
let markdownOption = false
pullModal = new bootstrap.Modal($('#pullBox')); // Create new modal
pullModal._config.backdrop = 'static';//disable modal from closing
infoModal = new bootstrap.Modal($('#infoBox')); //info modal
const nameModal = new bootstrap.Modal($('#documentNameBox'));//document name modal

//detects where the mouse is on the page
var currentMousePos = { x: -1, y: -1 };
$(document).mousemove(function(event) {
	currentMousePos.x = event.pageX;
	currentMousePos.y = event.pageY;
});

//on load
$(function() {
	//get the user's google data
	$.getJSON('/session', function(data) {

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