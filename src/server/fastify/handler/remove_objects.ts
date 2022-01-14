import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify"
import { getHTTPErrorCode, getTokenFromReq } from ".."
import { FindObjects, RemoveObjects } from "../../../local/Object"
import { ErrorHandler } from "../../../tool/error_handler"
import { checkCachedToken, verifyAuthJwt } from "../../../tool/jwt"
export const RemoveObjectSchema: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ["object_ids", "land_id"],
            properties: {
                object_ids: {
                    type: "array",
                    maxItems: 100,
                    items: {
                        type: "string"
                    }
                },
                land_id: { type: "string" }
            }
        },
        response: {
            200: {
                type: 'string',
            }
        }
    },
}

export async function removeObjects(req: FastifyRequest, rep: FastifyReply) {
    try {
        const token = getTokenFromReq(req)
        const tokenData = await verifyAuthJwt(token)
        await checkCachedToken(tokenData)
        const { object_ids, land_id } = req.body as { object_ids: string[], land_id: string }
        console.log(object_ids,land_id)
        RemoveObjects(object_ids, land_id)
        rep.send("OK")
    } catch (e: any) {
        ErrorHandler(e, { body: req.body }, removeObjects.name)
        const errorCode = getHTTPErrorCode(e)
        rep.code(errorCode)
        rep.send(e)
    }
}