// Imports express app
import { app } from '../main'
 
// Creates a route for the session 
app.get('/session', (request, response) => {
	response.send({
		id: request.session.googleid ?? null,
		email: request.session.email ?? null,
		name: request.session.name ?? null,
		pictureLink: request.session.pictureLink ?? null
	})
})