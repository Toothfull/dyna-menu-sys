import ws from 'ws'
import { webServer } from '../main' 
import { MongoDB } from '../classes/mongoclass'

//Websocket
export const wsServer = new ws.Server({
	server: webServer,
	path: '/websocket'
})

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

	})

	/*client.on( 'ping', () => {
		console.log('Pinging client...')
	} )*/

	client.on( 'pong', () => {
		console.log('Got ping from the client')

		//client.ping()
	} )

	client.on( 'close', ( code, reason ) => {
		console.log( `Client disconnected: ${code} ${reason}` )
	} )

	client.on( 'error', ( error ) => {
		console.log( `Error: ${error}` )
	} )

	

})

setInterval( () => {
	for (const client of wsServer.clients){
		client.ping()
		console.log('Pinging client...')
		console.log( `Number of clients: ${wsServer.clients.size}`)
	}
}, 10000 )