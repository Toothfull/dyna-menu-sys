//Imports express app and mongo class
import { app } from '../main'
import { MongoDB } from '../classes/mongoclass'

//Imports log4js and sets file name for this file
import { getLogger } from 'log4js'
import session from 'express-session'
const log = getLogger( 'authorisedoauth' )

//Imports clientID and clientSecret from .env file
const clientID = process.env.CLIENTID
const clientSecret = process.env.CLIENTSECRET

//Checks if any of the variables are empty
if(!clientID || !clientSecret){
	throw new Error('Missing environment variables')
}

//Creates a route for the authorisedoauth page and contacts google for their details
app.get('/authorisedoauth', async (request, response) => { 
	const authCode = request.query.code?.toString()
	const scope = request.query.scope?.toString()
	const state = request.query.state?.toString()
	const authUser = request.query.authuser?.toString()
	const prompt = request.query.prompt?.toString()

	//Checks if any of the variables are empty
	if (authCode == null || scope == null || state == null || authUser == null || prompt == null) {
		response.send('Error')
	} else { //If all variables are not empty

		//Creates a new URLSearchParams object
		const googleData = new URLSearchParams({
			'code': authCode,
			'client_id': clientID,
			'client_secret': clientSecret,
			'redirect_uri': 'http://localhost:9000/authorisedoauth',
			'grant_type': 'authorization_code'
		})
	
		//Fetches the details we require from google
		const googleResponse = await fetch('https://oauth2.googleapis.com/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: googleData.toString()
		})

		//Store googles response as a json object
		const googleResponseData = await googleResponse.json()

		//grabs the access token from the response data
		const accessToken = googleResponseData.access_token

		//Fetches the users details from google using their access token
		const googleUserDetails = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`, {
			method: 'GET'
		} )

		//Stores the users details as a json object
		const googleUserDetailsData = await googleUserDetails.json()

		//Stores the users details as variables
		const email : string = googleUserDetailsData.email.toString()
		const id : string = googleUserDetailsData.id.toString()
		const name : string = googleUserDetailsData.name.toString()
		const pictureLink : string = googleUserDetailsData.picture.toString()

		//Checks if the user is already in the database and if not, adds them
		const newUser = await MongoDB.addUser(email, id, name, pictureLink)
		if (!newUser){
			log.info('failed to insert new user (user already exists)')
		} else { //If the user is not in the database
			log.info(newUser)
			log.info('new user added')
		}

		//Regenerates the session and stores the users details in the session
		request.session.regenerate(async () => {
			request.session.googleid = id
			request.session.email = email
			request.session.name = name
			request.session.pictureLink = pictureLink

			//Checks if the user is verified and if so, redirects them to the index page
			const isVerified = await MongoDB.verifyUser(id)
			if (isVerified){
				response.redirect('/index.html')
			} else { //If the user is not verified, respond with not verified
				//destroys session and redirects to login page
				request.session.destroy(() => {
					response.redirect('/login.html?notverified=true') //Tags the url with notverified=true
				})
				
			}
		})
	}
})