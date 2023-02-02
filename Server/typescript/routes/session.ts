import { app } from '../main'

//import { getLogger } from 'log4js'
//const log = getLogger( 'session' )
 
app.get('/session', (request, response) => {
	response.send({
		id: request.session.googleid,
		email: request.session.email,
		name: request.session.name,
		pictureLink: request.session.pictureLink
	})
})