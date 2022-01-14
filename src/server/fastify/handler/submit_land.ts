import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify"
import { getHTTPErrorCode, getTokenFromReq } from ".."
import { SubmitLand } from "../../../local/Land"
import { ErrorHandler } from "../../../tool/error_handler"
import { checkCachedToken, verifyAuthJwt } from "../../../tool/jwt"
export const SubmitLandSchema: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ["land_id"],
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    result: {
                        type: ['array']

                    },

                }
            }
        }
    },
}

export async function submitLand(req: FastifyRequest, rep: FastifyReply) {
    try {
        const token = getTokenFromReq(req)
        const tokenData = await verifyAuthJwt(token)
        await checkCachedToken(tokenData)
        const { land_id } = req.body as { land_id: string }
        SubmitLand(land_id)
        rep.send("OK")
    } catch (e: any) {
        ErrorHandler(e, { body: req.body }, submitLand.name)
        const errorCode = getHTTPErrorCode(e)
        rep.code(errorCode)
        rep.send(e)
    }
}