import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify"
import { getHTTPErrorCode } from ".."
import { set_cache_user_token } from "../../../cache"
import { User } from "../../../database/mongo/models/User"
import { users } from "../../../database/mongo/mongo"
import { ErrMsg, ErrorHandler, ERROR_CODE } from "../../../tool/error_handler"
import { getAuthJWT } from "../../../tool/jwt"
import { getAddressFromSignMessage } from "../../../tool/utils"
export const logInSchema: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ["sign_message", "address", "timestamp"],
            properties: {
                sign_message: { type: 'string' },
                address: { type: 'string' },
                timestamp: { type: 'number' },
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    token: { type: 'string' },
                }
            }
        }
    }
}
const CheckValidTimestamp = (timestamp: number, valid_range_in_sec: number) => {
    const now_in_sec = ~~(+new Date() / 1000)
    const limit_valid_timestamp = now_in_sec - valid_range_in_sec
    return timestamp > limit_valid_timestamp
}

export const sendRep = (rep: FastifyReply, value: any) => {

    rep.send(value)
}
export async function logIn(req: FastifyRequest, rep: FastifyReply) {
    try {
        const { sign_message, address, timestamp } = req.body as { sign_message: string, address: string, timestamp: number }
        const is_valid_timestamp = CheckValidTimestamp(timestamp, 60)
        if (!is_valid_timestamp) throw ErrMsg(ERROR_CODE.TIME_STAMP_INVALID)
        const address_from_sign_message = getAddressFromSignMessage(timestamp, sign_message)
        const is_match_address = address_from_sign_message === address
        console.log({ address_from_sign_message, address })
        if (!is_match_address) throw ErrMsg(ERROR_CODE.SIGN_MESSAGE_INVALID)
        const found_user = await users.findOne({ address: address_from_sign_message })
        if (found_user) {
            await users.updateOne({ address: address_from_sign_message }, { $set: { last_login: new Date() } })
            const token = getAuthJWT(address_from_sign_message, timestamp)
            await set_cache_user_token(address_from_sign_message, { timestamp })
            rep.send({ token })
            return
        }
        const new_user: User = {
            address: address_from_sign_message,
            create_at: new Date(),
            last_login: new Date()
        }
        await users.insertOne(new_user)
        const token = getAuthJWT(address_from_sign_message, timestamp)
        await set_cache_user_token(address_from_sign_message, { timestamp })
        sendRep(rep, { token })
    } catch (e: any) {
        ErrorHandler(e, { body: req.body }, logIn.name)
        const errorCode = getHTTPErrorCode(e)
        rep.code(errorCode)
        sendRep(rep, e)
    }
}