import { recoverAddressBySignature } from "../blockchain/bsc"
import { ErrMsg, ERROR_CODE } from "./error_handler"

export const sleep = async (ms: number) => {
    await new Promise((resolver, reject) => {
        setTimeout(() => resolver("OK"), ms)
    })
}


export const createRunePackArray = (runes: { runeId: number, quantity: number }[]) => {
    const results: number[] = []
    for (let rune of runes) {
        results[rune.runeId] = rune.quantity
    }
    for (let i = 0; i < 12; i++) {
        if (!results[i]) results[i] = 0
    }
    return results
}

export const getAddressFromSignMessage = (timestamp: number, signMessage: string) => {
    try {
        return recoverAddressBySignature(timestamp, signMessage)
    } catch (e: any) {
        throw ErrMsg(ERROR_CODE.SIGN_MESSAGE_INVALID)
    }
    // return signMessage
}

