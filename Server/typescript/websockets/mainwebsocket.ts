import ws from 'ws'
import { webServer } from '../main' 

//Websocket
export const wsServer = new ws.Server({ server: webServer, path: '/websocket' })


//Once a client connects...
wsServer.on('connection', (client) => {
	console.log('New connection!')

	//Once the server recieves a message from a client...
	client.on('message', async  (message) => {
		console.log('Message recieved: ' + message.toString())


	})

})