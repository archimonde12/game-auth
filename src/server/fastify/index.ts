import Fastify, { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify"
import { PORT, SERVER_CODE, SERVER_NAME } from "../../config"
import path from "path";
import { successConsoleLog } from "../../tool/color-log"
import { HTTP_ERROR_CODE } from "../../tool/http-error"
import { logIn, logInSchema } from "./handler/log_in"
import { refresh, RefreshSchema } from "./handler/refresh"
import { CreateSignMessageSchema, test_create_sign_message } from "./handler/test_create_sign_message"
import { userInfo, UserInfoSchema } from "./handler/user_info"
import websocket from "fastify-websocket"
import cors from "fastify-cors"
import { BlockTypesSchema, getBlockTypes } from "./handler/get_block_types";
import { getLandList, LandListSchema } from "./handler/get_lands_list";
const fastify = Fastify({ logger: false })
// const fastify = Fastify({ logger: false })
fastify.register(cors, (instance) => (req, callback) => {
    // const clientIp = requestIp.getClientIp(req);
    callback(null, { origin: false }) // callback expects two parameters: error and options
})
const methods = {
    log_in: "/log_in",
    get_land_list: "/get_land_list",
    get_block_types: "/get_block_types",
    refresh: "/refresh",
    user_info: "/user_info",
    create_sign_message: "/create_sign_message",
}
fastify.register(websocket)
fastify.get('/ws', { websocket: true }, function wsHandler(conn, req) {
    conn.socket.on('message', (message: Buffer) => {
        const data = JSON.parse(message.toString())
        console.log(data)
        // message.toString() === 'hi from client'
        // conn.socket.send('hi from server')
    })
    // conn.socket.emit("message", "Hello world")
    // conn.socket.on('message', message => {
    //     // message.toString() === 'hi from client'
    //     conn.socket.send('hi from server')
    // })
    conn.socket.send(JSON.stringify({}))
})
fastify.post(methods.log_in, logInSchema, logIn)
fastify.post(methods.create_sign_message, CreateSignMessageSchema, test_create_sign_message)
fastify.get(methods.user_info, UserInfoSchema, userInfo)
fastify.get(methods.refresh, RefreshSchema, refresh)
fastify.get(methods.get_block_types, BlockTypesSchema, getBlockTypes)
fastify.get(methods.get_land_list, LandListSchema, getLandList)
fastify.register(require("fastify-static"), {
    root: path.join(__dirname, "/../../../apidoc"),
    prefix: "/"
})

fastify.addHook("preHandler", (req, rep, done) => {
    rep.header("Access-Control-Allow-Origin", "*")
    rep.header("Access-Control-Allow-Credentials", "true")
    rep.header("Access-Control-Allow-Headers", "Accept, X-Access-Token, X-Application-Name, X-Request-Sent-Time")
    rep.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    done()
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
    console.log({authorization})
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