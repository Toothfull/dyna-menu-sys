import ws from 'ws'
import { webServer } from '../main' 

//Websocket
export const wsServer = new ws.Server({
	server: webServer,
	path: '/websocket'
})

//Once a client connects...	
wsServer.on('connection', (client) => {
	console.log('New connection!')

	client.send( JSON.stringify( {
		data: 'Hello from the server!!'
	} ) )

	//Once the server recieves a message from a client...
	client.on('message', async  (message) => {
		console.log( JSON.parse( message.toString() ) )

		client.send( JSON.stringify( {
			data: 'Thank you for the message!!!'
		} ) )
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

	setInterval( () => {
		console.log( 'Sending ping to client...' )
		client.ping()
	}, 10000 )

})