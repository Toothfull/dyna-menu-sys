// Import express app and mongo class
import { app } from '../main'
import { MongoDB } from '../classes/mongoclass'
import { breakApartText } from '../functions/breakaparttext'

// Imports log4js and configures it
import { getLogger } from 'log4js'
const log = getLogger( 'updatemenu' )

// Sets up the updatemenu route and expects 2 json objects
app.post('/updatemenu', async (request, response) => {
	try {
		await MongoDB.insertMenuDocument(breakApartText(request.body.markdown), request.body.fileName) // Inserts the menu into the database
	}
	catch (error) { // if errors
		log.error(error)
		log.info('Failed to insert menu document')
	}
	response.send('Menu recieved') // Sends a success response to the client
})