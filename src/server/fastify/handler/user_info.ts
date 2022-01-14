import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify"
import { getHTTPErrorCode, getTokenFromReq } from ".."
import { users } from "../../../database/mongo/mongo"
import { ErrorHandler } from "../../../tool/error_handler"
import { checkCachedToken, verifyAuthJwt } from "../../../tool/jwt"
import { sendRep } from "./log_in"
export const UserInfoSchema: RouteShorthandOptions = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    result: {
                        type: ['null', 'object'], properties: {
                            _id: { type: 'string' },
                            address: { type: 'string' },
                            create_at: { type: 'string' },
                            last_login: { type: 'string' },
                        }
                    },

                }
            }
        }
    },
}


export async function userInfo(req: FastifyRequest, rep: FastifyReply) {
    try {
        const token = getTokenFromReq(req)
        const tokenData = await verifyAuthJwt(token)
        await checkCachedToken(tokenData)
        const user_data = await users.findOne({ address: tokenData.address })
        sendRep(rep, { result: user_data })
    } catch (e: any) {
        ErrorHandler(e, { body: req.body }, userInfo.name)
        const errorCode = getHTTPErrorCode(e)
        rep.code(errorCode)
        sendRep(rep,e)
    }
}