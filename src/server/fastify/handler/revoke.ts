import {  RouteShorthandOptions } from "fastify"

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
        }
    }
}


