//Imports express and session from packages
import express from 'express'
import expressSession from 'express-session'

//imports mongo class and random string function
import { MongoDB } from './classes/mongoclass'
import { randomString } from './functions/randomstring'

//Imports log4js and configures it
import { configure, getLogger } from 'log4js'
configure( {
	appenders: {
		console: { type: 'stdout' },
		//file: { type: "file", filename: "./logs/server.log" }
	},
	categories: {
		'default': { appenders: [ 'console' ], level: 'info' },
		'main': { appenders: [ 'console' ], level: 'info' },
		'mongo': { appenders: [ 'console' ], level: 'info' },
	}
} )
const log = getLogger( 'main' )

//Creates express app and sets port
export const app = express()
const port = 9000
declare module 'express-session' { //Creates a session
	export interface SessionData {
		googleid: string;
		email: string;
		name: string;
		pictureLink: string;
		state: string;
	}
}

//Serves the cleint files to the user's browser
app.use(express.static('../Browser/'))
app.use(express.json())
//Sets up the session
app.use( expressSession( {
	name: 'id',
	secret: randomString(16),
	resave: true,
	saveUninitialized: false,
	cookie: {
		domain: 'localhost',
		path: '/',
	}
} ) )

//Imports all the routes used by the server
import './routes/session'
import './routes/oauthlink'
import './routes/authorisedoauth'
import './routes/upload'
import './routes/latest'
import './routes/logout'
import './routes/updatemenu'
import './routes/deletealldocuments'
import './routes/deletelastdocument'

//Starts the server and connects to the database
app.listen(port, async () => {
	log.info('Example app listening on port ' + port)
	await MongoDB.initialConnection()
})
