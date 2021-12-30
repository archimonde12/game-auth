import { ClearRedis } from "../cache"
import { initRedis } from "../cache/redis"
import { collections, connectMongo, mongo } from "../database/mongo/mongo"

const reset = async () => {
    //Remove redis
    await initRedis()
    ClearRedis()
    //Remove mongo
    await connectMongo()
    for (let collection_name of Object.values(collections)) {
        const deleteRes = await mongo.db().collection(collection_name).deleteMany({})
        console.log(`Delete ${deleteRes.deletedCount} in collection ${collection_name}`)
    }
    //Remove local
    console.log(`DONE ...`)
    return
}

reset()