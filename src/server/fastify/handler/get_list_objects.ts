import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify"
import { getHTTPErrorCode, getTokenFromReq } from ".."
import { FindObjects } from "../../../local/Object"
import { ErrorHandler } from "../../../tool/error_handler"
import { checkCachedToken, verifyAuthJwt } from "../../../tool/jwt"
export const ObjectListSchema: RouteShorthandOptions = {
    schema: {
        querystring: {
            type: 'object',
            required: ["x", "y", "r", "land_id"],
            properties: {
                x: { type: 'number' },
                y: { type: 'number' },
                r: { type: 'number' },
                land_id: { type: 'string' },
            }
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

export async function getListObject(req: FastifyRequest, rep: FastifyReply) {
    try {
        const token = getTokenFromReq(req)
        const tokenData = await verifyAuthJwt(token)
        await checkCachedToken(tokenData)
        const { x, y, r, land_id } = req.query as { x: number, y: number, z: number, r: number, land_id: string }
        rep.send({ result: FindObjects({ x, y, r, landId: land_id }) })
    } catch (e: any) {
        ErrorHandler(e, { body: req.body }, getListObject.name)
        const errorCode = getHTTPErrorCode(e)
        rep.code(errorCode)
        rep.send(e)
    }
}