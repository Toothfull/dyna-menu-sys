import { app } from '../main'
import { breakApartFile } from '../functions/breakapartfile'
import { insertMenuDocument } from '../mongo'

import fs from 'fs'
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

import { getLogger } from 'log4js'
const log = getLogger( 'upload' )

app.put('/upload', upload.single('file'), async (request, response) => {
	const file = request.file
	if (file == null) {
		log.info('No file uploaded')
	} else {
		log.info('File uploaded')
		const fileLines = breakApartFile(file.path)
		try {
			await insertMenuDocument(fileLines, file.originalname)
			fs.rmSync(file.path)
		} catch (error) {
			log.error(error)
			log.info('Failed to insert menu document and delete local files')
		}
		
		log.info(fileLines)
	}
	response.send('File uploaded')
})