import express from 'express'
import expressSession from 'express-session'

import { addUser, initialConnection, verifyUser, insertMenuDocument, getMenuDocument } from './mongo'

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

import multer from 'multer'
const upload = multer({
	dest: './uploads/',
	fileFilter : function (req, file, cb) {
		if (file.mimetype !== 'text/plain') {
			log.info('file not accepted')
			log.info(file.originalname, file.mimetype)
			return cb(null, false)
		} else {
			log.info('file accepted')
			return cb(null, true)
		}
	}
})

import fs from 'fs'

const app = express()
const port = 9000 
const clientID = '604742774438-n3saa7d0qp5qi5m5cau1ugd3ee6ih942.apps.googleusercontent.com'
const clientSecret = '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'
declare module 'express-session' {
	export interface SessionData {
		googleid: string;
		email: string;
		name: string;
		pictureLink: string;
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

app.get('/oauthlink', (_, response) => {
	//log.info('got')
	const state = randomString(16)
	response.send(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=http://localhost:9000/authorisedoauth&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&access_type=online&state=${state}&prompt=consent&include_granted_scopes=true`)
}) 

app.get('/authorisedoauth', async (request, response) => { 
	const authCode = request.query.code?.toString()
	const scope = request.query.scope?.toString()
	const state = request.query.state?.toString()
	const authUser = request.query.authuser?.toString()
	const prompt = request.query.prompt?.toString()

	if (authCode == null || scope == null || state == null || authUser == null || prompt == null) {
		response.send('Error')
	} else {
		//log.info(authCode, scope, state, authUser, prompt)

		const googleData = new URLSearchParams({
			'code': authCode,
			'client_id': clientID,
			'client_secret': clientSecret,
			'redirect_uri': 'http://localhost:9000/authorisedoauth',
			'grant_type': 'authorization_code'
		})
	
		const googleResponse = await fetch('https://oauth2.googleapis.com/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: googleData.toString()
		})

		const googleResponseData = await googleResponse.json()
		//console.dir(googleResponseData)

		const accessToken = googleResponseData.access_token
		//const tokenType = googleResponseData.token_type
		//const expiresIn = googleResponseData.expires_in
		//const scopeNew = googleResponseData.scope
		//const idToken = googleResponseData.id_token

		const googleUserDetails = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`, {
			method: 'GET'
		} )

		const googleUserDetailsData = await googleUserDetails.json()

		const email : string = googleUserDetailsData.email.toString()
		const id : string = googleUserDetailsData.id.toString()
		const name : string = googleUserDetailsData.name.toString()
		const pictureLink : string = googleUserDetailsData.picture.toString()

		const newUser = await addUser(email, id, name, pictureLink)
		if (!newUser){
			log.info('failed to insert new user')
		} else {
			log.info(newUser)
			log.info('new user added')
		}

		request.session.regenerate(async () => {
			request.session.googleid = id
			request.session.email = email
			request.session.name = name
			request.session.pictureLink = pictureLink

			const isVerified = await verifyUser(id)
			if (isVerified){
				response.redirect('/index.html')
			} else {
				response.send('not verified')
			}
		})
	}
})

app.get('/session', (request, response) => {
	response.send({
		id: request.session.googleid,
		email: request.session.email,
		name: request.session.name,
		pictureLink: request.session.pictureLink
	})
})

app.put('/upload', upload.single('file'), async (request, response) => {
	const file = request.file
	if (file == null) {
		log.info('No file uploaded')
	} else {
		log.info('File uploaded')
		const fileLines = breakApartFile(file.path)
		try {
			await insertMenuDocument(fileLines)
			fs.rmSync(file.path)
		} catch (error) {
			log.error(error)
			log.info('Failed to insert menu document and delete local files')
		}
		
		log.info(fileLines)
	}
	response.send('File uploaded')
})

app.get('/latest', async (request, response) => {
	const latestMenu = await getMenuDocument()
	response.send({
		latestMenu: latestMenu
	})
})

app.listen(port, async () => {
	log.info('Example app listening on port ' + port)
	await initialConnection()
})

//Create a function which creates a random 16 character string
function randomString(length: number) {
	let result = ''
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	const charactersLength = characters.length
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}
	return result
}

//Create a function that reads a file
function breakApartFile(path: string) {
	const selectedFile = fs.readFileSync(path)
	const fileData = selectedFile.toString()

	const fileDataArray = fileData.split('\n')
	return fileDataArray
}
