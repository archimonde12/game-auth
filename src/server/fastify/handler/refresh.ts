import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify"

import { check_cached_token, getAuthJWT, verifyAuthJwt } from "../../../tool/jwt"
import { ErrorHandler } from "../../../tool/error_handler"
import { set_cache_user_token } from "../../../cache"
import { timeSystem } from "../../../tool/time-system"

import { getHTTPErrorCode, getTokenFromReq } from ".."
import { sendRep } from "./log_in"

export const RefreshSchema: RouteShorthandOptions = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    token: { type: "string" },
                }
            }
        }
    },
}


export async function refresh(req: FastifyRequest, rep: FastifyReply) {
    try {
        const token = getTokenFromReq(req)
        const tokenData = await verifyAuthJwt(token)
        await check_cached_token(tokenData)
        const now_in_sec = timeSystem.getNowInSec()
        const new_token = getAuthJWT(tokenData.address, now_in_sec)
        await set_cache_user_token(tokenData.address, { timestamp: now_in_sec })
        sendRep(rep, { token: new_token })
    } catch (e: any) {
        ErrorHandler(e, { body: req.body }, refresh.name)
        const errorCode = getHTTPErrorCode(e)
        rep.code(errorCode)
        sendRep(rep,e)
    }
}