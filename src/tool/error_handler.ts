import { SERVER_CODE } from "../config"
import { CaptureException } from "../logging/sentry"

export const genCodeName = (msg: string) => `${SERVER_CODE}:${msg}`
export const ErrMsg = (msg: string) => {
    return new Error(genCodeName(msg))
}


/**
 * Show the error and capture exception to Sentry
 * @param e error 
 * @param args params of user 
 * @param funcName Name of function
 */

export function ErrorHandler(e: any, args: any, funcName: string) {
    const { message } = e
    const { password, ...params } = args
    if (message.startsWith(`${SERVER_CODE}:`)) {
        const errCode = message.substring(0, SERVER_CODE.length) + message.substring(SERVER_CODE.length + 1);
        console.log('\n========================================================================================\n')
        console.log('\x1b[33m%s\x1b[0m', `⚠️  WARNING : EXPECTED ERROR HAPPENED!\n`)
        console.log('Function:', funcName)
        console.log(e)
        console.log(`Argument:`, JSON.parse(JSON.stringify(params)))
        console.log(`Message:`, ErrCodeMessage[errCode] ? ErrCodeMessage[errCode] : message.substring(SERVER_CODE.length + 1))
        console.log('\n========================================================================================')
        throw new Error(message)
    } else {
        console.log('\n========================================================================================\n')
        console.log('\x1b[31m%s\x1b[0m', `🔥  🔥  🔥  DANGER : UNEXPECTED ERROR HAPPENED!\n `)
        console.log('Function:', funcName)
        console.log(e)
        console.log(`Argument:`, JSON.parse(JSON.stringify(params)))
        console.log('\n========================================================================================')
        CaptureException(e, { args: JSON.parse(JSON.stringify(args)) })
        throw ErrMsg(ERROR_CODE.UNEXPECTED_ERROR)
    }
}

const ErrCodeMessage = {
    BOX000: "Action fail because unexpected error",
}

export const ERROR_CODE = {
    //==========UNEXPECTED ERROR==========
    UNEXPECTED_ERROR: '000',
    //==========AUTH==============
}