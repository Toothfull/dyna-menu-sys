import express from 'express'
import expressSession from 'express-session'

import { MongoDB } from './classes/mongoclass'
import { randomString } from './functions/randomstring'

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


export const app = express()
const port = 9000 
declare module 'express-session' {
	export interface SessionData {
		googleid: string;
		email: string;
		name: string;
		pictureLink: string;
		state: string;
	}
}

app.use(express.static('../Browser/'))
app.use(express.json())
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

import './routes/session'
import './routes/oauthlink'
import './routes/authorisedoauth'
import './routes/upload'
import './routes/latest'

app.listen(port, async () => {
	log.info('Example app listening on port ' + port)
	await MongoDB.initialConnection()
})
