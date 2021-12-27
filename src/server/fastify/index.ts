import Fastify from "fastify"
import { SERVER_NAME } from "../../config"
import { successConsoleLog } from "../../tool/color-log"
import { logIn } from "./handler/logIn"

const fastify = Fastify({ logger: false })
const methods = {
    log_in: "/logIn",
    revoke: "/revoke",
    auto_sign: "/autoSign",
    auto_sign_out: "/autoSignOut"
}
fastify.post(methods.log_in, logIn)
export const initFastify = async () => {
    try {
        const quest = await fastify.listen(3000)
        successConsoleLog(`🚀 ${SERVER_NAME} fastify ready at ${quest}`);
    } catch (err: any) {
        fastify.log.error(err)
    }
}

