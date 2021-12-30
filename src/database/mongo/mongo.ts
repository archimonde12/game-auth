import { Collection, MongoClient, ReadPreference } from "mongodb";
import { errorConsoleLog, successConsoleLog } from "../../tool/color-log";
import { MONGO_URI } from "../../config";
import { User, UserIndexes } from "./models/User";

let mongo: MongoClient
export let users:Collection<User>
const collections = {
    users: "users"
}

export const checkModelInDb = async (params: { schema: any, collection: Collection<any> }[]) => {
    try {
        for (let param of params) {
            const { collection, schema } = param
            console.log(`checking in collection ${collection.collectionName} ...`)
            const notPassSchemaItems = await collection.find({ $nor: [{ $jsonSchema: schema }] }).toArray()
            if (notPassSchemaItems.length > 0) throw new Error(`${collection.collectionName} collection has ${notPassSchemaItems.length} item(s) not pass schema`)
        }
    } catch (e) {
        throw e
    }
}


const connectMongo = async () => {
    try {
        console.log(`mongodb: connecting ...`)
        mongo = await new MongoClient(MONGO_URI, {
            ignoreUndefined: true, // find: {xxx: {$exists: false}}
            readPreference: ReadPreference.PRIMARY,
        }).connect()

        mongo.on('error', async (e) => {
            try {
                await mongo.close()
                await connectMongo()
            } catch (e) {
                setTimeout(connectMongo, 1000)
                throw e
            }
        })

        mongo.on('timeout', async () => {
            try {
                await mongo.close()
                await connectMongo()
            } catch (e) {
                setTimeout(connectMongo, 1000)
                throw e
            }
        })

        mongo.on('close', async () => {
            try {
                await connectMongo()
            } catch (e) {
                throw e
            }
        })

        const db = mongo.db()
        users = db.collection(collections.users)
        console.log(`mongodb: insert indexes ...`)
        await Promise.all([
            users.createIndexes(UserIndexes),
        ])
        successConsoleLog(`🚀 mongodb: connected`)
    } catch (e) {
        errorConsoleLog(`mongodb: disconnected`)
        await mongo?.close(true)
        setTimeout(connectMongo, 1000)
        throw e
    }
}

export const mongoCheckModel = async () => {
    try {
        console.log(`mongodb: checking model and document schema ...`)
        await checkModelInDb([

        ])
    } catch (e) {
        throw e
    }
}

export {
    mongo,
    connectMongo,
    collections
}