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
import { methods } from "./methos";
import { ChunkListSchema, getListChunks } from "./handler/get_list_chunks";
import { getListObject, ObjectListSchema } from "./handler/get_list_objects";
import { SendChunksSchema, sendListChunks } from "./handler/send_list_chunk";
import { sendListObjects, SendObjectsSchema } from "./handler/send_list_object";
import { submitLand, SubmitLandSchema } from "./handler/submit_land";
import { resetLand, ResetLandSchema } from "./handler/reset_land";
import { removeObjects, RemoveObjectSchema } from "./handler/remove_objects";
import { AddLand } from "../../local/Land";
import { LAND_LIST } from "../../mockup-data/Lands";
//https://www.fastify.io/docs/latest/Reference/Validation-and-Serialization/
const fastify = Fastify({ logger: false })
fastify.register(cors, (instance) => (req, callback) => {
    callback(null, { origin: false }) // callback expects two parameters: error and options
})

fastify.register(websocket)
fastify.get('/ws', { websocket: true }, function wsHandler(conn, req) {
    conn.socket.on('message', (message: Buffer) => {
        const data = JSON.parse(message.toString())
        console.log(data)
    })
    conn.socket.send(JSON.stringify({}))
})
fastify.post(methods.log_in, logInSchema, logIn)
fastify.post(methods.create_sign_message, CreateSignMessageSchema, test_create_sign_message)
fastify.get(methods.user_info, UserInfoSchema, userInfo)
fastify.get(methods.refresh, RefreshSchema, refresh)
fastify.get(methods.get_block_types, BlockTypesSchema, getBlockTypes)
fastify.get(methods.get_land_list, LandListSchema, getLandList)
fastify.get(methods.get_list_chunks, ChunkListSchema, getListChunks)
fastify.get(methods.get_list_objects, ObjectListSchema, getListObject)
fastify.post(methods.send_list_chunk, SendChunksSchema, sendListChunks)
fastify.post(methods.send_list_object, SendObjectsSchema, sendListObjects)
fastify.post(methods.submit_land, SubmitLandSchema, submitLand)
fastify.post(methods.reset_land, ResetLandSchema, resetLand)
fastify.post(methods.remove_objects, RemoveObjectSchema, removeObjects)
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
        const server = await fastify.listen({ port: PORT, host: "0.0.0.0" })
        successConsoleLog(`🚀 ${SERVER_NAME} fastify ready at ${server}`);
        for (let land of LAND_LIST) { 
            AddLand(land)
        }
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