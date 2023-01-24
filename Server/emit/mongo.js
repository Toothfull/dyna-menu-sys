"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeConnection = exports.verifyUser = exports.addUser = exports.initialConnection = void 0;
// @deno-types="npm:@types/mongodb"
const mongodb_1 = require("mongodb");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({
    path: '../.env'
});
if (process.env.USERNAME == undefined) {
    throw new Error('username is undefined');
}
if (process.env.PASSWORD == undefined) {
    throw new Error('password is undefined');
}
if (process.env.HOST == undefined) {
    throw new Error('host is undefined');
}
if (process.env.PORT == undefined) {
    throw new Error('port is undefined');
}
if (process.env.DATABASENAME == undefined) {
    throw new Error('databasename is undefined');
}
if (process.env.COLLECTIONNAME1 == undefined) {
    throw new Error('collectionname1 is undefined');
}
if (process.env.COLLECTIONNAME2 == undefined) {
    throw new Error('collectionname2 is undefined');
}
const userName = process.env.USERNAME;
const password = process.env.PASSWORD;
const host = process.env.HOST;
const port = process.env.PORT;
const databaseName = process.env.DATABASENAME;
const collectionName1 = process.env.COLLECTIONNAME1;
const collectionName2 = process.env.COLLECTIONNAME2;
console.log(userName, password, host, port, databaseName, collectionName1, collectionName2);
if (!userName || !password || !host || !databaseName || !port || !collectionName1 || !collectionName2) {
    throw new Error('Missing environment variables');
}
const connectionString = `mongodb://${userName}:${password}@${host}:${port}/${databaseName}?directConnection=true&tls=false`;
const client = new mongodb_1.MongoClient(connectionString);
function initialConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log('Connected successfully to server');
        }
        catch (err) {
            yield client.close();
            console.log(err);
            console.log('Connection failed');
        }
        return client;
    });
}
exports.initialConnection = initialConnection;
function addUser(email, id, name, pictureLink) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const database = client.db(databaseName);
            const userCollection = database.collection(collectionName2);
            const user1 = yield userCollection.findOne({ id: id });
            if (user1 == undefined) {
                return yield userCollection.insertOne({
                    email: email,
                    id: id,
                    name: name,
                    pictureLink: pictureLink,
                    authorised: false
                });
            }
            else {
                throw new Error('User already exists');
            }
        }
        catch (err) {
            console.log(err);
            console.log('Error adding user');
            return null;
        }
    });
}
exports.addUser = addUser;
function verifyUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const database = client.db(databaseName);
            const userCollection = database.collection(collectionName2);
            const useridList = yield userCollection.find({
                authorised: true
            }).toArray();
            console.log(useridList);
            for (let i = 0; i < useridList.length; i++) {
                if (useridList[i].id == id) {
                    return true;
                }
            }
            return false;
        }
        catch (err) {
            console.log(err);
            console.log('Error verifying user');
            return false;
        }
    });
}
exports.verifyUser = verifyUser;
function closeConnection(client) {
    client.close();
}
exports.closeConnection = closeConnection;
