import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify"
import { zeros } from "mathjs"
import { getHTTPErrorCode, getTokenFromReq } from ".."
import { Chunk } from "../../../database/mongo/models/Chunk"
import { Land } from "../../../database/mongo/models/Land"
import { GetChunks } from "../../../local/Chunk"
import { ErrorHandler } from "../../../tool/error_handler"
import { checkCachedToken, verifyAuthJwt } from "../../../tool/jwt"
export const ChunkListSchema: RouteShorthandOptions = {
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

export async function getListChunks(req: FastifyRequest, rep: FastifyReply) {
    try {
        const token = getTokenFromReq(req)
        const tokenData = await verifyAuthJwt(token)
        await checkCachedToken(tokenData)
        const { x, y, r, land_id } = req.query as { x: number, y: number, z: number, r: number, land_id: string }
        console.log(x, y, r, land_id)

        rep.send({ result: GetChunks(Number(x), Number(y), Number(r), land_id) })
    } catch (e: any) {
        ErrorHandler(e, { body: req.body }, getListChunks.name)
        const errorCode = getHTTPErrorCode(e)
        rep.code(errorCode)
        rep.send(e)
    }
}