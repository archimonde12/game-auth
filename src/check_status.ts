import { errorConsoleLog, successConsoleLog } from "./tool/color-log"
import { connectMongo, mongo } from "./database/mongo/mongo"
import { initRedis, ioredis } from "./cache/redis"
export const check_status = async (not_first_run?: boolean) => {
    try {
        console.log("========================")
        if (!not_first_run) {
            successConsoleLog("SERVER STARTING")
            await Promise.all([
                initRedis(),
                connectMongo(),
            ])
            return
        }
        const mongo_connect_status = true
        const redis_connect_status = await ioredis.ping()

        successConsoleLog("CHECK SERVER HEATH")
        if (!mongo_connect_status) {
            errorConsoleLog("❌ mongo is disconnected. Try to reconnect ...")
            await connectMongo()
        } else {
            successConsoleLog("mongo")
        }
        if (!redis_connect_status) {
            errorConsoleLog("❌ redis is disconnected. Try to reconnect ...")
            await initRedis()
        } else {
            successConsoleLog("redis")
        }
    } catch (e) {
        console.log(e)
    } finally {
        setTimeout(() => check_status(true), 60000)
    }
}