import { FastifyReply, FastifyRequest } from "fastify"

export async function logIn(req: FastifyRequest, rep: FastifyReply) {
    try {
        const body = req.body
        console.log({body})
        rep.send("Hello")
    } catch (e) {
        throw e
    }
}