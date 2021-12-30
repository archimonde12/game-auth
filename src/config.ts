import { config } from "dotenv";

config()

if (!process.env.NODE_ENV) throw new Error(`NODE_ENV must be provided`)

export const NODE_ENV = process.env.NODE_ENV

if (!process.env.DEBUG) throw new Error(`DEBUG must be provided`)
if (!["true", "false"].includes(process.env.DEBUG.toLowerCase())) throw new Error(`DEBUG must be true or false`)
export const DEBUG = JSON.parse(process.env.DEBUG)

if (!process.env.SERVER_NAME) throw new Error(`SERVER_NAME must be provided`)
export const SERVER_NAME = process.env.SERVER_NAME

if (!process.env.SENTRY_DNS) throw new Error(`SENTRY_DNS must be provided`)
export const SENTRY_DNS = process.env.SENTRY_DNS

if (!process.env.SENTRY_SERVER_NAME) throw new Error(`SENTRY_SERVER_NAME must be provided`)
export const SENTRY_SERVER_NAME = process.env.SENTRY_SERVER_NAME

if (!process.env.APP_SECRET) throw new Error(`APP_SECRET must be provided`)
export const APP_SECRET = process.env.APP_SECRET

if (!process.env.MONGO_URI) throw new Error(`MONGO_URI must be provided`)
export const MONGO_URI = process.env.MONGO_URI

if (!process.env.PORT) throw new Error(`PORT must be provided`)
export const PORT = parseInt(process.env.PORT)

if (!process.env.REDIS_URI) throw new Error(`REDIS_URI must be provided`)
export const REDIS_URI = process.env.REDIS_URI

if (!process.env.REDIS_PREFIX) throw new Error(`REDIS_PREFIX must be provided`)
export const REDIS_PREFIX = process.env.REDIS_PREFIX


if (!process.env.SERVER_CODE) throw new Error(`SERVER_CODE must be provided`)
export const SERVER_CODE = process.env.SERVER_CODE

if (!process.env.JWT_AUTH_EXPIRATION_IN_SEC) throw new Error(`JWT_AUTH_EXPIRATION_IN_SEC must be provided`)
export const JWT_AUTH_EXPIRATION_IN_SEC = parseInt(process.env.JWT_AUTH_EXPIRATION_IN_SEC)



