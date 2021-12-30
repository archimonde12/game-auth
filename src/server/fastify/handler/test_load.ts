import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify"
export const testLoadSchema: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ["size"],
            properties: {
                size: { type: 'number' },
            }
        }
    }
}

function MakeId(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
export async function test_load(req: FastifyRequest, rep: FastifyReply) {
    try {
        console.time("gen_result")
        const { size } = req.body as { size: number }
        const result = MakeId(size)
        console.timeEnd("gen_result")
        rep.send(result)
    } catch (e) {
        throw e
    }
}