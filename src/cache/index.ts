import { REDIS_PREFIX } from "../config";
import { set_cache_user_token, get_cache_user_token } from "./cache_user_token";
import { ioredis } from "./redis";

export const create_key_with_prefix = (key: string) => `${REDIS_PREFIX}.${key}`
export const ClearRedis = () => {
    let stream = ioredis.scanStream({
        match: `${REDIS_PREFIX}*`
    })
    stream.on('data', (keys) => {
        if (keys.length) {
            var pipeline = ioredis.pipeline();
            keys.forEach((key) => {
                pipeline.del(key)
            })
            return pipeline.exec()
        }
    })
}
export {
    //SET
    set_cache_user_token,
    //GET
    get_cache_user_token
}