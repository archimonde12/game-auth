import * as Sentry from "@sentry/node";
import { NODE_ENV, SENTRY_DNS, SERVER_NAME } from "../config";

const initSentry = () => Sentry.init({ dsn: SENTRY_DNS, serverName: SERVER_NAME, environment: NODE_ENV })
const CaptureException = (error: any, data: any) => {
    console.log(error)
    Sentry.addBreadcrumb({ data })
    Sentry.captureException(error)
}
export { initSentry, Sentry, CaptureException }