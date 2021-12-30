import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify"
import { getTokenFromReq } from ".."
import { get_cache_user_token } from "../../../cache"
import { users } from "../../../database/mongo/mongo"
import { ErrorHandler } from "../../../tool/error_handler"
import { verifyAuthJwt } from "../../../tool/jwt"
export const UserInfoSchema: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ["sign_message", "address", "timestamp"],
            properties: {
                sign_message: { type: 'string' },
                address: { type: 'string' },
                timestamp: { type: 'number' },
            }
        }
    }
}


export async function userInfo(req: FastifyRequest, rep: FastifyReply) {
    try {
        const token = getTokenFromReq(req)
        const { address } = await verifyAuthJwt(token)
        const user_data = await users.findOne({ address })
        return user_data
    } catch (e) {
        ErrorHandler(e, { body: req.body }, userInfo.name)
        rep.send(e)
    }
}