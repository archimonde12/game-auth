import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify"
import { getHTTPErrorCode, getTokenFromReq } from ".."
import { Object } from "../../../database/mongo/models/Object"
import { UpdateObjects } from "../../../local/Object"
import { ErrorHandler } from "../../../tool/error_handler"
import { checkCachedToken, verifyAuthJwt } from "../../../tool/jwt"
export const SendObjectsSchema: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ["objects"],
            properties: {
                objects: {
                    type: 'array',
                    items: {
                        type: "object",
                        required: ["landId", "objectHash", "objectId", "x", "y", "z", "width", "height", "depth", "rotateX", "rotateY", "rotateZ", "objectData"],
                        properties: {
                            landId: { type: 'string' },
                            objectHash: { type: 'string' },
                            objectId: { type: 'string' },
                            x: { type: 'number' },
                            y: { type: 'number' },
                            z: { type: 'number' },
                            width: { type: 'number' },
                            height: { type: 'number' },
                            depth: { type: 'number' },
                            rotateX: { type: 'number' },
                            rotateY: { type: 'number' },
                            rotateZ: { type: 'number' },
                            objectData: { type: 'string' },
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

export async function sendListObjects(req: FastifyRequest, rep: FastifyReply) {
    try {
        const token = getTokenFromReq(req)
        const tokenData = await verifyAuthJwt(token)
        await checkCachedToken(tokenData)
        const { objects } = req.body as { objects: Object[] }
        UpdateObjects(objects)
        rep.send("OK")
    } catch (e: any) {
        ErrorHandler(e, { body: req.body }, sendListObjects.name)
        const errorCode = getHTTPErrorCode(e)
        rep.code(errorCode)
        rep.send(e)
    }
}