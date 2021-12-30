import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify"
import { getHTTPErrorCode, getTokenFromReq } from ".."
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
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    user_info: { type: ['null', 'object'] },
                    properties: {
                        _id: { type: 'string' },
                        address: { type: 'string' },
                        create_at: { type: 'string' },
                        last_login: { type: 'string' },
                    }
                }
            }
        }
    },


}


export async function userInfo(req: FastifyRequest, rep: FastifyReply) {
    try {
        const token = getTokenFromReq(req)
        const { address } = await verifyAuthJwt(token)
        const user_data = await users.findOne({ address })
        return { user_info: user_data }
    } catch (e: any) {
        ErrorHandler(e, { body: req.body }, userInfo.name)
        const errorCode = getHTTPErrorCode(e)
        rep.code(errorCode).send(e)
    }
}