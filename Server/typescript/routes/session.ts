// Imports express app
import { app } from '../main'
 
// Creates a route for the session 
app.get('/session', (request, response) => {
	response.send({
		id: request.session.googleid,
		email: request.session.email,
		name: request.session.name,
		pictureLink: request.session.pictureLink
	})
})