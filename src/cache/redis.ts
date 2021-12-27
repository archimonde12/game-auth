import Redis from "ioredis"
import { successConsoleLog } from "../tool/color-log";
import { REDIS_URI } from "../config";
export let ioredis: Redis.Redis

export const initRedis = async () => {
    ioredis = new Redis(REDIS_URI, {
        retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
        },
    });
    if (ioredis["connector"]["connecting"]) {
        successConsoleLog(`🚀 redis: connected`)
    }
}

export const get_redis_connection_status = () => ioredis["connector"]["connecting"]