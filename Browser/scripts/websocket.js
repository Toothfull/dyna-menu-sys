
$(function() {
	let scheme = 'ws:'
	if (window.location.protocol == 'https:') {
		scheme = 'wss:'
	}
	const hostname = window.location.host
	const webSocket = new WebSocket(`${scheme}//${hostname}/websocket`);
	webSocket.onopen = function () {
		console.log('Connected to websocket');

		webSocket.send(JSON.stringify({
			event: 'device',
			data: {
				type: 'browser'
			}
		}))
		
	}
	webSocket.onclose = function() {
		console.log('Disconnected from websocket');		
	}
	webSocket.onerror = function( error ){
		console.log(error)
	}
	webSocket.onmessage = function (event) {
		
		const dataFromServer = JSON.parse(event.data)
		console.log(dataFromServer)
		$('#numberOfDevices').text(dataFromServer.data.deviceCount.toString())

	}
});