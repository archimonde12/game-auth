import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify"
import { getHTTPErrorCode } from ".."
import { genSignature } from "../../../blockchain/bsc"
import { ErrorHandler } from "../../../tool/error_handler"
import { sendRep } from "./log_in"

export const CreateSignMessageSchema: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ["private_key", "timestamp"],
            properties: {
                private_key: { type: 'string' },
                timestamp: { type: 'number' },
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    signature: { type: 'string' },
                }
            }
        }
    }
}


export async function test_create_sign_message(req: FastifyRequest, rep: FastifyReply) {
    try {
        const { private_key, timestamp } = req.body as { private_key: string, timestamp: number }
        const sign_message = genSignature(timestamp, private_key)
        sendRep(rep, { signature: sign_message.signature })
    } catch (e:any) {
        ErrorHandler(e, { body: req.body }, test_create_sign_message.name)
        const errorCode = getHTTPErrorCode(e)
        rep.code(errorCode)
        sendRep(rep,e)
    }
}
