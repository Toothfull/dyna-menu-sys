// Import express app and mongo class
import { app } from '../main'
import { randomString } from '../functions/randomstring'

// collects clientID from .env file
const clientID = process.env.CLIENTID
const uri = process.env.REDIRECTURI

// checks if clientID is empty
if(!clientID || !uri){
	throw new Error('Missing environment variables')
}

// Creates route for storing a state within the session
app.get('/oauthlink', (request, response) => {
	const state = randomString(16)
	request.session.state = state
	response.send(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=http://${uri}/authorisedoauth&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&access_type=online&state=${state}&prompt=consent&include_granted_scopes=true`)
}) 