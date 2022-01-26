import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify"
import { getHTTPErrorCode, getTokenFromReq } from ".."
import { ErrorHandler } from "../../../tool/error_handler"
import { checkCachedToken, verifyAuthJwt } from "../../../tool/jwt"
export const SetLandSchema: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ["value"],
            properties: {
                value: { type: 'number' },
            }
        },
        response: {
            200: {
                type: 'string',

            }
        }
    },
}

export let land_number = 2
export const local_get_land_number = () => {
    return land_number
}
const local_set_land_number = (number: number) => {
    land_number = number
}

export async function set_land_number(req: FastifyRequest, rep: FastifyReply) {
    try {
        const { value } = req.body as { value: number }
        local_set_land_number(value)
        rep.send("OK")
    } catch (e: any) {
        ErrorHandler(e, { body: req.body }, set_land_number.name)
        const errorCode = getHTTPErrorCode(e)
        rep.code(errorCode)
        rep.send(e)
    }
}