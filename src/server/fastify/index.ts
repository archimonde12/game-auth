import Fastify, { FastifyRequest, RouteShorthandOptions } from "fastify"
import { PORT, SERVER_NAME } from "../../config"
import { successConsoleLog } from "../../tool/color-log"
import { logIn, logInSchema } from "./handler/log_in"
import { CreateSignMessageSchema, test_create_sign_message } from "./handler/test_create_sign_message"
import { userInfo } from "./handler/user_info"

const fastify = Fastify({ logger: false })
const methods = {
    log_in: "/log_in",
    user_info: "/user_info",
    create_sign_message: "/create_sign_message",
}
fastify.post(methods.log_in, logInSchema, logIn)
fastify.post(methods.user_info, userInfo)
fastify.post(methods.create_sign_message, CreateSignMessageSchema, test_create_sign_message)

export const initFastify = async () => {
    try {
        const quest = await fastify.listen({port:PORT,host:"0.0.0.0"})
        successConsoleLog(`🚀 ${SERVER_NAME} fastify ready at ${quest}`);
    } catch (err: any) {
        console.log(err)
        fastify.log.error(err)
    }
}



export const getTokenFromReq = (req: FastifyRequest) => {
        const { authorization } = req.headers
        return authorization
}
