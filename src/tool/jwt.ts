import { sign, verify } from "jsonwebtoken";
import { get_cache_user_token } from "../cache";

import { APP_SECRET, JWT_AUTH_EXPIRATION_IN_SEC } from "../config";
import { ErrMsg, ERROR_CODE } from "./error_handler";

enum JwtType {
    auth = 'auth',
}


const getJWT = (obj: any, exp_in_sec: any): string => sign({ ...obj, exp: Math.round(Date.now() / 1000) + exp_in_sec }, APP_SECRET)

const verifyJWT = (token: string, type: string): any => {
    try {
        const verified = verify(token, APP_SECRET) as any
        const is_valid_type = verified.type === type
        if (!is_valid_type) throw ErrMsg(ERROR_CODE.TOKEN_INVALID)
        return verified
    } catch (error) {
        throw ErrMsg(ERROR_CODE.TOKEN_INVALID)
    }
}

interface AuthJwt {
    address: string
    timestamp: number
    type: JwtType
}

export const getAuthJWT = (address: string, timestamp: number): string => getJWT({ address, timestamp, type: 'auth' }, JWT_AUTH_EXPIRATION_IN_SEC)


export const verifyAuthJwt = async (token: string | undefined): Promise<AuthJwt> => {
    try {
        if (!token) throw ErrMsg(ERROR_CODE.TOKEN_MISSING)
        const verified = verifyJWT(token, JwtType.auth) as AuthJwt
        if (verified?.address && verified?.timestamp) {
            const cached_token = await get_cache_user_token(verified.address)
            console.log(cached_token)
            const cached_token_exist = cached_token ? true : false
            const cached_timestamp_not_match = cached_token?.timestamp !== verified.timestamp
            if (cached_token_exist && cached_timestamp_not_match) throw ErrMsg(ERROR_CODE.TOKEN_EXPIRED)
            return verified
        }
        throw ErrMsg(ERROR_CODE.TOKEN_INVALID)
    } catch (e: any) {
        throw e.message === 'jwt expired' || e.name === 'TokenExpiredError' ? ErrMsg(ERROR_CODE.TOKEN_EXPIRED) : e
    }
}



