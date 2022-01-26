import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify"
import { getHTTPErrorCode, getTokenFromReq } from ".."
import { ErrorHandler } from "../../../tool/error_handler"
import { verifyAuthJwt } from "../../../tool/jwt"
export const VerifyTokenSchema: RouteShorthandOptions = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    verify_result:{
                        type:'string'
                    }
                }
            }
        }
    },
}

export async function verify_token(req: FastifyRequest, rep: FastifyReply) {
    try {
        const token = getTokenFromReq(req)
        const verify_result = await verifyAuthJwt(token).then(res => "OK").catch(e => { return e.message }) as string
        rep.send({ verify_result })
    } catch (e: any) {
        ErrorHandler(e, { body: req.body }, verify_token.name)
        const errorCode = getHTTPErrorCode(e)
        rep.code(errorCode)
        rep.send(e)
    }
}