import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify"
import { getHTTPErrorCode, getTokenFromReq } from ".."
import { Land } from "../../../database/mongo/models/Land"
import { GetAllLands, LocalLands } from "../../../local/Land"
import { ErrorHandler } from "../../../tool/error_handler"
import { checkCachedToken, verifyAuthJwt } from "../../../tool/jwt"
export const LandListSchema: RouteShorthandOptions = {
    schema: {
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

export async function getLandList(req: FastifyRequest, rep: FastifyReply) {
    try {
        const token = getTokenFromReq(req)
        const tokenData = await verifyAuthJwt(token)
        await checkCachedToken(tokenData)
        console.log(GetAllLands())
        rep.send({ result: GetAllLands() })
    } catch (e: any) {
        ErrorHandler(e, { body: req.body }, getLandList.name)
        const errorCode = getHTTPErrorCode(e)
        rep.code(errorCode)
        rep.send(e)
    }
}