import { app } from '../main'
import { randomString } from '../functions/randomstring'

// import { getLogger } from 'log4js'
// const log = getLogger( 'oauthlink' )

const clientID = process.env.CLIENTID

if(!clientID){
	throw new Error('Missing environment variables')
}

app.get('/oauthlink', (request, response) => {
	const state = randomString(16)
	request.session.state = state
	response.send(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=http://localhost:9000/authorisedoauth&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&access_type=online&state=${state}&prompt=consent&include_granted_scopes=true`)
}) 