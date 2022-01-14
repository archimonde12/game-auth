import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify"
import { getHTTPErrorCode, getTokenFromReq } from ".."
import { Chunk } from "../../../database/mongo/models/Chunk"
import { UpdateChunks } from "../../../local/Chunk"
import { ErrorHandler } from "../../../tool/error_handler"
import { checkCachedToken, verifyAuthJwt } from "../../../tool/jwt"

export const SendChunksSchema: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ["chunks"],
            properties: {
                chunks: {
                    type: 'array',
                    items: {
                        type: "object",
                        required: ["landId", "chunkId", "x", "y", "z", "blockTypes", "blocks"],
                        properties: {
                            landId: { type: 'string' },
                            chunkId: { type: 'string' },
                            x: { type: 'number' },
                            y: { type: 'number' },
                            z: { type: 'number' },
                            blockTypes: { type: 'array', items: { type: "number" } },
                            blocks: { type: 'array', items: { type: 'array', items: { type: "number" } } },
                        }
                    }
                },

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

export async function sendListChunks(req: FastifyRequest, rep: FastifyReply) {
    try {
        const token = getTokenFromReq(req)
        const tokenData = await verifyAuthJwt(token)
        await checkCachedToken(tokenData)
        const { chunks } = req.body as { chunks: Chunk[] }
        UpdateChunks(chunks)
        rep.send("OK")
    } catch (e: any) {
        ErrorHandler(e, { body: req.body }, sendListChunks.name)
        const errorCode = getHTTPErrorCode(e)
        rep.code(errorCode)
        rep.send(e)
    }
}