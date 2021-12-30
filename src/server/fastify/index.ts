import Fastify, { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify"
import { PORT, SERVER_CODE, SERVER_NAME } from "../../config"
import path from "path";
import { successConsoleLog } from "../../tool/color-log"
import { HTTP_ERROR_CODE } from "../../tool/http-error"
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
fastify.get(methods.user_info, userInfo)
fastify.post(methods.create_sign_message, CreateSignMessageSchema, test_create_sign_message)
fastify.register(require("fastify-static"), {
    root: path.join(__dirname, "/../../../apidoc"),
    prefix: "/"
})

export const initFastify = async () => {
    try {
        const quest = await fastify.listen({ port: PORT, host: "0.0.0.0" })
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

export const getHTTPErrorCode = (e: Error) => {
    const start_message = e.message.substring(0, SERVER_CODE.length + 2)
    switch (start_message) {
        case `${SERVER_CODE}:1`:
            return HTTP_ERROR_CODE.UNAUTHORIZED_401
        case `${SERVER_CODE}:2`:
            return HTTP_ERROR_CODE.BAD_REQUEST_400
        default:
            return HTTP_ERROR_CODE.INTERNAL_SERVER_ERROR_500
    }
}