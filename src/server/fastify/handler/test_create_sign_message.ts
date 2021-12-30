import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify"
import { genSignature } from "../../../blockchain/bsc"
import { ErrorHandler } from "../../../tool/error_handler"

export const CreateSignMessageSchema: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ["private_key", "timestamp"],
            properties: {
                private_key: { type: 'string' },
                timestamp: { type: 'number' },
            }
        }
    }
}


export async function test_create_sign_message(req: FastifyRequest, rep: FastifyReply) {
    try {
        const { private_key, timestamp } = req.body as { private_key: string, timestamp: number }
        console.log({ private_key, timestamp })
        const sign_message = genSignature(timestamp, private_key)
        rep.send({ signature: sign_message.signature })
    } catch (e) {
        ErrorHandler(e, { body: req.body }, test_create_sign_message.name)
        rep.send(e)
    }
}
