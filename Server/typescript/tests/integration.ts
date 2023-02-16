import chai from 'chai'
import { app } from '../main.js'
import { MongoDB } from '../classes/mongoclass.js'
import chaiHttp from 'chai-http'
import chaiString from 'chai-string'
import fs from 'fs'

chai.use( chaiHttp )
chai.use( chaiString )

suite( 'Integration tests', () => {

	suiteSetup(async() => {
		fs.writeFileSync('./uploads/test.txt', 'this is dummy test data')

		await MongoDB.initialConnection()
		const fileLines = ['test', 'test', 'test']
		const fileName = 'test.txt'
		await MongoDB.insertMenuDocument(fileLines, fileName)
	} )

	suiteTeardown(() => {
		MongoDB.deleteAllDocuments()

		fs.rmSync('./uploads/test.txt')
	})

	test( 'Testing logout route', ( done ) => {
		chai.request(app).get('/logout').send().end((_, Response) => {
			chai.assert.equal(Response.status, 200, 'Status code is not 200')
			chai.assert.equal(Response.text, '/login.html', 'Response text is not login page URL')
			done()
		})
	} )

	test( 'Test latest route', (done) => {
		chai.request(app).get('/latest').send().end((_, Response) => {
			chai.assert.equal(Response.status, 200, 'Status code is not 200')
			chai.assert.isAtLeast( new Date( Response.body.timestamp ).getTime(), new Date().getTime() - ( 10 * 1000 ), 'Response timestamp is not within 10 seconds of current time')
			done()
		})
	} )

	test( 'Oauth link is provided', ( done ) => {
		chai.request(app).get('/oauthlink').send().end((_, Response) => {
			chai.assert.equal(Response.status, 200, 'Status code is not 200')
			chai.assert.startsWith(Response.text, 'https://accounts.google.com', 'Response is does not begin with https://accounts.google.com')
			done()
		})
	} )

	test( 'Session keys are all provided', ( done ) => {
		chai.request(app).get('/session').send().end((_, Response) => {
			chai.assert.equal(Response.status, 200, 'Status code is not 200')
			chai.assert.hasAllKeys(Response.body, [ 'id', 'name', 'email', 'pictureLink' ], 'Not all keys are present in response body')
			done()
		})

	} )

	test( 'Upload document route', ( done ) => {
		const mockFile = fs.readFileSync('./uploads/test.txt')

		chai.request(app).put('/upload').set('content-type', 'multipart/form-data').attach('file', mockFile, 'test.txt').end((_, Response) => {
			chai.assert.equal(Response.status, 200, 'Status code is not 200')
			chai.assert.equal(Response.text, 'File uploaded', 'Response text is not "File uploaded"')
			done()
		})
	} )

	test( 'Check if user is not authorised', ( done ) => {
		chai.request(app).get('/authorisedoauth').send().end((_, Response) => {
			chai.assert.equal(Response.status, 200, 'Status code is not 200')
			chai.assert.equal(Response.text, 'Error', 'User was authorised')      
			done()
		})
		
	} )

	test( 'Check if menu is sent to mongo', (done) => {
		chai.request(app).post('/updatemenu').send({markdown: 'test\ntest\ntest', fileName: 'test.txt'}).end((_, Response) => {
			chai.assert.equal(Response.status, 200, 'Status code is not 200')
			chai.assert.equal(Response.text, 'Menu recieved', 'Response text is not "Menu recieved"')
			done()
		})
	})

} )