import { app } from '../main'
import { MongoDB } from '../classes/mongoclass'

//Imports the mongo class and log4js
import { getLogger } from 'log4js'
const log = getLogger( 'deletelastdocument' )

//Deletes all the earliest document in the database
app.get('/deletelastdocument', async (_, res) => {
	log.info('Deleting last documents')
	await MongoDB.deleteLatestDocument()
	res.send('Deleted last document')
})
