import { app } from '../main'
import { MongoDB } from '../classes/mongoclass'

//Imports the mongo class and log4js
import { getLogger } from 'log4js'
const log = getLogger( 'deletealldocuments' )

//Deletes all documents in the database
app.get('/deletealldocuments', async (_, res) => {
    log.info('Deleting all documents')
    await MongoDB.deleteAllDocuments()
    res.send('Deleted all documents')
})
