import fs from 'fs'

// import { getLogger } from 'log4js'
// const log = getLogger( 'breakapartfile' )

//Create a function that reads a file
export function breakApartFile(path: string) {
	const selectedFile = fs.readFileSync(path)
	const fileData = selectedFile.toString()

	const fileDataArray = fileData.split('\n')
	return fileDataArray
}