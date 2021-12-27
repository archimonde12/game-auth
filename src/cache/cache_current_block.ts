import { create_key_with_prefix } from "."
import { ioredis } from "./redis"

export const get_cache_current_block = async () => {
    const key = create_key_with_prefix("current_block")
    const value = await ioredis.get(key)
    return value
}

export const set_cache_current_block = async (current_block: number) => {
    const key = create_key_with_prefix("current_block")
    const value = await ioredis.set(key, current_block)
    if (value === "OK") {
        return current_block
    } else throw new Error(`Fail to set ${key} on redis`)
}