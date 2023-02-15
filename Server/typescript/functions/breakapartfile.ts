//import fs package from 'fs'
import fs from 'fs'

//Create a function that reads a file and turns its contents into a string array
export function breakApartFile(path: string) {
	const selectedFile = fs.readFileSync(path)
	const fileData = selectedFile.toString()

	const fileDataArray = fileData.split('\n')
	return fileDataArray
}