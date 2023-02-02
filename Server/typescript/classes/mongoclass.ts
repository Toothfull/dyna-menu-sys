import { MongoClient, WithId, Document, Db } from 'mongodb'
import { config } from 'dotenv'
config({
	path: '../.env'
})

//log4js
import { getLogger } from 'log4js'
import { initialConnection } from '../mongo'
const log = getLogger( 'mongoclass' )

// Interfaces
interface menuDocument extends WithId <Document> {
	timestamp: Date
	fileLines : string[]
	fileName : string
} 

export default class MongoDB {

	public static client : MongoClient
	public static database : Db
	public static collectionName1 : string
	public static collectionName2 : string

	public static async initialConnection () {

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

		if(!userName || !password || !host || !databaseName || !port || !collectionName1 || !collectionName2){
			throw new Error('Missing environment variables')
		}

		const connectionString = `mongodb://${userName}:${password}@${host}:${port}/${databaseName}?directConnection=true&tls=false`
		const client =	new MongoClient(connectionString)

		try{
			await client.connect()
			log.info('Connected successfully to server')
			MongoDB.database = client.db(databaseName)
			MongoDB.collectionName1 = collectionName1
			MongoDB.collectionName2 = collectionName2
		} catch(err) {
			await client.close()
			log.error(err)
			log.info('Error connecting to server')
		}
		return client
	}

	public static async addUser (email : string, id : string, name :string, pictureLink :string){
		try {
			const userCollection = MongoDB.database.collection(MongoDB.collectionName2)
			
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
			log.error(err)
			log.info('Error adding user')
			return null
		}
	}

	public static async verifyUser (id : string) {

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
		catch (err) {
			log.error(err)
			log.info('Error verifying user')
			return false
		}
	}

	public static async insertMenuDocument (fileLines : string[], fileName : string){
		const menuCollection = MongoDB.database.collection(MongoDB.collectionName1)
		try {
			await menuCollection.insertOne({
				fileName : fileName.replace('.txt', ''),
				timestamp : new Date(),
				fileLines : fileLines
			})
		} catch (err) {
			log.error(err)
			log.info('Error inserting menu document')
		}
	}

	public static async getMenuDocument (){
		const menuCollection = MongoDB.database.collection<menuDocument>(MongoDB.collectionName1)
		try {
			const menuDocument = await menuCollection.find().sort({timestamp: -1}).limit(1).toArray()
			return menuDocument[0]
		} catch (err) {
			log.error(err)
			log.info('Error getting menu document')
			return null
		}
	}

	public static async closeConnection(client: MongoClient){
		client.close()
	}

}
