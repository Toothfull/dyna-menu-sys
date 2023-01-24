// @deno-types="npm:@types/mongodb"
import { MongoClient } from 'mongodb'
import { config } from 'dotenv'
config({
	path: '../.env'
})


if (process.env.USERNAME==undefined){
	throw new Error('username is undefined')
}
if (process.env.PASSWORD==undefined){
	throw new Error('password is undefined')
}
if (process.env.HOST==undefined){
	throw new Error('host is undefined')
}
if (process.env.PORT==undefined){
	throw new Error('port is undefined')
}
if (process.env.DATABASENAME==undefined){
	throw new Error('databasename is undefined')
}
if (process.env.COLLECTIONNAME1==undefined){
	throw new Error('collectionname1 is undefined')
}
if (process.env.COLLECTIONNAME2==undefined){
	throw new Error('collectionname2 is undefined')
}

const userName = process.env.USERNAME
const password = process.env.PASSWORD
const host = process.env.HOST
const port = process.env.PORT
const databaseName = process.env.DATABASENAME
const collectionName1 = process.env.COLLECTIONNAME1
const collectionName2 = process.env.COLLECTIONNAME2

console.log( userName, password, host, port, databaseName, collectionName1, collectionName2 )

if(!userName || !password || !host || !databaseName || !port || !collectionName1 || !collectionName2){
	throw new Error('Missing environment variables')
}

const connectionString = `mongodb://${userName}:${password}@${host}:${port}/${databaseName}?directConnection=true&tls=false`
const client =	new MongoClient(connectionString)

export async function initialConnection () {
	try{
		await client.connect()
		console.log('Connected successfully to server')
	} catch(err) {
		await client.close()
		console.log(err)
		console.log('Connection failed')
	}
	return client
}

export async function addUser (email : string, id : string, name :string, pictureLink :string) {
	try {
		const database = client.db(databaseName)
		const userCollection = database.collection(collectionName2)
		
		const user1 = await userCollection.findOne({ id: id })

		if (user1 == undefined){
			return await userCollection.insertOne({
				email: email,
				id: id,
				name: name,
				pictureLink: pictureLink,
				authorised: false
			})
		}
		else { 
			throw new Error('User already exists')
		}
	}
	catch (err) {
		console.log(err)
		console.log('Error adding user')
		return null
	}
}

export async function verifyUser (id : string) {

	try {
		const database = client.db(databaseName)
		const userCollection = database.collection(collectionName2)
		const useridList = await userCollection.find({
			authorised: true
		}).toArray()

		console.log(useridList)
	
		for (let i = 0; i < useridList.length; i++) {
			if (useridList[i].id == id) {
				return true
			}
		}

		return false
	} 
	catch (err) {
		console.log(err)
		console.log('Error verifying user')
		return false
	}




}

export function closeConnection(client: MongoClient){
	client.close()
}