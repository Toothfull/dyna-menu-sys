import { app } from '../main'
import { MongoDB } from '../classes/mongoclass'

import { getLogger } from 'log4js'
const log = getLogger( 'latest' )

app.get('/latest', async (request, response) => {
	const latestMenu = await MongoDB.getMenuDocument()
	if (latestMenu==null) {
		log.info('No menu found')
		response.send('null')
	} else {
		response.send({
			fileLines: latestMenu?.fileLines,
			timestamp: latestMenu?.timestamp,
			fileName: latestMenu?.fileName
		})
	}
})