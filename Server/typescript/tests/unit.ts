import chai from 'chai'
import fs from 'fs'
import { breakApartFile } from '../functions/breakapartfile'
import { randomString } from '../functions/randomstring'
import { breakApartText } from '../functions/breakaparttext'

suite( 'Unit tests', () => {

	suiteSetup(() => {
		fs.writeFileSync('./uploads/test1.txt', 'this is\n dummy test\n data')
	} )

	suiteTeardown(() => {
		//fs.rmSync("./uploads/test1.txt")
	})

	test( 'break apart file', () => {
		const result = breakApartFile('./uploads/test1.txt')
		chai.assert.lengthOf(result, 3, 'More than 3 values were found')
	} )

	test( 'Length of random string', () => {
		const number = 69
		const randomStringAnswer = randomString(number)
		chai.assert.lengthOf(randomStringAnswer, number, 'Random string is not the correct length')
	} )

	test ('String is returned as a list', () => { 
		const string = 'this is\n a string'
		const result = breakApartText(string)
		chai.assert.lengthOf(result, 2, 'More than 2 values were found')
	})

} )