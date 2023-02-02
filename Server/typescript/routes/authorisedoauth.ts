import { app } from '../main'
import { MongoDB } from '../classes/mongoclass'

import { getLogger } from 'log4js'
const log = getLogger( 'authorisedoauth' )

const clientID = process.env.CLIENTID
const clientSecret = process.env.CLIENTSECRET

if(!clientID || !clientSecret){
	throw new Error('Missing environment variables')
}

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

		const googleUserDetails = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`, {
			method: 'GET'
		} )

		const googleUserDetailsData = await googleUserDetails.json()

		const email : string = googleUserDetailsData.email.toString()
		const id : string = googleUserDetailsData.id.toString()
		const name : string = googleUserDetailsData.name.toString()
		const pictureLink : string = googleUserDetailsData.picture.toString()

		const newUser = await MongoDB.addUser(email, id, name, pictureLink)
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

			const isVerified = await MongoDB.verifyUser(id)
			if (isVerified){
				response.redirect('/index.html')
			} else {
				response.send('not verified')
			}
		})
	}
})