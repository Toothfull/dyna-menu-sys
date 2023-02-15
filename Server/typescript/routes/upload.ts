// Imports express app, mongo class and breakapartfile function
import { app } from '../main'
import { breakApartFile } from '../functions/breakapartfile'
import { MongoDB } from '../classes/mongoclass'

//Imports log4js and sets file name for this file
import { getLogger } from 'log4js'
const log = getLogger( 'upload' )

//Imports fs and multer packages
import fs from 'fs'
import multer from 'multer'
const upload = multer({ //Sets the upload destination and file filter
	dest: './uploads/',
	fileFilter : function (req, file, cb) {
		if (file.mimetype !== 'text/plain') { //Checks if the file is a text file. if not...
			log.info('file not accepted')
			log.info(file.originalname, file.mimetype)
			return cb(null, false)
		} else { //If the file is a text file
			log.info('file accepted')
			return cb(null, true)
		}
	}
})

//Sets up the upload route and expects a file
app.put('/upload', upload.single('file'), async (request, response) => {
	const file = request.file
	if (file == null) { //If no file is uploaded
		log.info('No file uploaded')
	} else { //If a file is uploaded
		log.info('File uploaded')
		const fileLines = breakApartFile(file.path) //Breaks the file into an array of lines
		try { //Inserts the file into the database
			await MongoDB.insertMenuDocument(fileLines, file.originalname)
			fs.rmSync(file.path)
		} catch (error) { //If the file fails to insert into the database
			log.error(error)
			log.info('Failed to insert menu document and delete local files')
		}
		
		log.info(fileLines)
	}
	response.send('File uploaded') //Sends a success response to the client
})