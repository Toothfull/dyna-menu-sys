// Imports express app and mongo class
import { app } from '../main'
import { MongoDB } from '../classes/mongoclass'

// Imports log4js and sets file name for this file
import { getLogger } from 'log4js'
const log = getLogger( 'latest' )

// Creates a route for the latest menudocument and returns the latest menu/timestamp/filename
app.get('/latest', async (request, response) => {
	const latestMenu = await MongoDB.getMenuDocument()
	if (latestMenu==null) { //If no menu is found
		log.info('No menu found')
		response.send('null')
	} else { //If a menu is found
		response.send({ //Send the menu/timestamp/filename
			fileLines: latestMenu?.fileLines,
			timestamp: latestMenu?.timestamp,
			fileName: latestMenu?.fileName
		})
	}
})