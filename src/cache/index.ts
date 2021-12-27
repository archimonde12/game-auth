import { REDIS_PREFIX } from "../config";

export const create_key_with_prefix = (key: string) => `${REDIS_PREFIX}.${key}`

export {
    //SET
    //GET
    get_cache_current_block,
}