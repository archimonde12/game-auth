import { create_key_with_prefix } from "."
import { ioredis } from "./redis"

type TokenHeader = {
    timestamp: number
}
export const get_cache_user_token = async (user: string) => {
    const key = create_key_with_prefix(`token.${user}`)
    const value = await ioredis.get(key)
    console.log(value)
    return JSON.parse(value || "null") as TokenHeader | null
}

export const set_cache_user_token = async (user: string, value: TokenHeader) => {
    const key = create_key_with_prefix(`token.${user}`)
    const response = await ioredis.set(key, JSON.stringify(value))
    if (response === "OK") {
        return "OK"
    } else throw new Error(`Fail to set ${key} on redis`)
}