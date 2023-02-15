//Import mongo packages
import { MongoClient, WithId, Document, Db } from 'mongodb'
//log4js config for this file
import { config } from 'dotenv'
config({
	path: '../.env'
})
//log4js
import { getLogger } from 'log4js'
const log = getLogger( 'mongoclass' )

// Interfaces
interface menuDocument extends WithId <Document> {
	timestamp: Date
	fileLines : string[]
	fileName : string
} 

//Mongo class
export class MongoDB {

	//Data base details from .env file
	public static client : MongoClient
	public static database : Db
	public static collectionName1 : string
	public static collectionName2 : string

	//Initial connection to database
	public static async initialConnection () {

		//Checks for any missing environment variables from .env file
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

		//Gets environment variables from .env file and stores them in variables
		const userName = process.env.USERNAME
		const password = process.env.PASSWORD
		const host = process.env.HOST
		const port = process.env.PORT
		const databaseName = process.env.DATABASENAME
		const collectionName1 = process.env.COLLECTIONNAME1
		const collectionName2 = process.env.COLLECTIONNAME2

		//Checks if any of the variables are empty
		if(!userName || !password || !host || !databaseName || !port || !collectionName1 || !collectionName2){
			throw new Error('Missing environment variables')
		}

		//Creates connection string to database
		const connectionString = `mongodb://${userName}:${password}@${host}:${port}/${databaseName}?directConnection=true&tls=false`
		//Creates new mongo client with connection string
		const client =	new MongoClient(connectionString)

		//Connects to database
		try{
			await client.connect()
			log.info('Connected successfully to server')
			MongoDB.database = client.db(databaseName)
			MongoDB.collectionName1 = collectionName1
			MongoDB.collectionName2 = collectionName2
		} catch(err) { //If connection fails
			await client.close()
			log.error(err)
			log.info('Error connecting to server')
		}
		return client
	}

	//Adds google user to database
	public static async addUser (email : string, id : string, name :string, pictureLink :string){
		try {
			const userCollection = MongoDB.database.collection(MongoDB.collectionName2)
			
			const user1 = await userCollection.findOne({ id: id })
	
			if (user1 == undefined){ //If user does not exist in database
				return await userCollection.insertOne({
					email: email,
					id: id,
					name: name,
					pictureLink: pictureLink,
					authorised: false
				})
			}
			else { //If user already exists in database
				throw new Error('User already exists')
			}
		}
		catch (err) { //If error occurs
			log.error(err)
			log.info('Error adding user')
			return null
		}
	}

	//Verifies if the user is in the database
	public static async verifyUser (id : string) {

		//Checks if user is in database and if they have the authorised tag set to true
		try {
			const userCollection = MongoDB.database.collection(MongoDB.collectionName2)
			const useridList = await userCollection.find({
				authorised: true
			}).toArray()
	
			log.info(useridList)
		
			for (let i = 0; i < useridList.length; i++) {
				if (useridList[i].id == id) {
					return true
				}
			}
	
			return false
		} 
		catch (err) { //if user is not in database
			log.error(err)
			log.info('Error verifying user (user not verified)')
			return false
		}
	}

	//Creates a new menu document in the database with timestamp
	public static async insertMenuDocument (fileLines : string[], fileName : string){
		const menuCollection = MongoDB.database.collection(MongoDB.collectionName1)
		try { //try inserting menu document
			await menuCollection.insertOne({
				fileName : fileName.replace('.txt', ''),
				timestamp : new Date(),
				fileLines : fileLines
			})
		} catch (err) { //If error occurs
			log.error(err)
			log.info('Error inserting menu document')
		}
	}

	//Retrieves the latest menu document from the database
	public static async getMenuDocument (){
		const menuCollection = MongoDB.database.collection<menuDocument>(MongoDB.collectionName1)
		try { //try getting menu document with the earliest timestamp
			const menuDocument = await menuCollection.find().sort({timestamp: -1}).limit(1).toArray()
			return menuDocument[0]
		} catch (err) { //If error occurs
			log.error(err)
			log.info('Error getting menu document')
			return null
		}
	}

	//deletes all documents from the database
	public static async deleteAllDocuments (){
		const meuCollection = MongoDB.database.collection<menuDocument>(MongoDB.collectionName1)
		await meuCollection.deleteMany({})
		console.log('All documents from the database')
	}

	//Closes connection to database
	public static async closeConnection(client: MongoClient){
		client.close()
	}
}
