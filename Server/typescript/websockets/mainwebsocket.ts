import ws from 'ws'
import { webServer } from '../main' 
import { MongoDB } from '../classes/mongoclass'

//Websocket
export const wsServer = new ws.Server({
	server: webServer,
	path: '/websocket'
})

const androidDevices: ws.WebSocket[] = []
const browserDevices: ws.WebSocket[] = []

//Once a client connects...	
wsServer.on('connection', (client) => {
	console.log('New connection!')

	//Once the server recieves a message from a client...
	client.on('message', async  (message) => {
		const messageFromClient =  JSON.parse(message.toString())
		const messageFromClientEvent = messageFromClient.event
		const messageFromClientData = messageFromClient.data

		if (messageFromClientEvent === 'canIHaveDocument'){
			const latestdocument = await MongoDB.getMenuDocument()
			client.send(JSON.stringify({
				event: 'hereIsDocument',
				data: latestdocument
			}))
		}

		if (messageFromClientEvent ==  'device') {
			const deviceType = messageFromClientData.type
			if (deviceType == 'android'){
				androidDevices.push(client)
				console.log('Android device connected')
			}
			if (deviceType == 'browser'){
				browserDevices.push(client)
				console.log('Browser device connected')
			}
		}

	})

	client.on( 'pong', () => {
		console.log('Got ping from the client')


	} )

	client.on( 'close', ( code, reason ) => {
		console.log( `Client disconnected: ${code} ${reason}` )

		// remove client from array
		const index = androidDevices.indexOf(client)
		if (index > -1) {
			androidDevices.splice(index, 1)
		}
		const index2 = browserDevices.indexOf(client)
		if (index2 > -1) {
			browserDevices.splice(index2, 1)
		}

	} )

	client.on( 'error', ( error ) => {
		console.log( `Error: ${error}` )

		// remove client from array
		const index = androidDevices.indexOf(client)
		if (index > -1) {
			androidDevices.splice(index, 1)
		}
		const index2 = browserDevices.indexOf(client)
		if (index2 > -1) {
			browserDevices.splice(index2, 1)
		}
	} )	

})

setInterval( () => {
	for (const client of wsServer.clients){
		client.ping()
		console.log('Pinging client...')
		console.log( `Number of clients: ${wsServer.clients.size}`)
	}

	for (const client of browserDevices){
		client.send(JSON.stringify({
			event: 'deviceCount',
			data: {
				deviceCount: androidDevices.length
			}
		}))

	}
}, 10000 )