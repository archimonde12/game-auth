import Web3 from "web3";
import { successConsoleLog } from "../../tool/color-log";
export let web3: Web3

export const connectWeb3 = async (provider: string) => {
    try {
        web3 = new Web3(new Web3.providers.HttpProvider(provider));
        successConsoleLog(`🚀 connect to web3 through ${provider}`)
    }
    catch (e) {
        throw e
    }
}

export function recoverAddressBySignature(timestamp: number, signature: string) {
    return web3.eth.accounts.recover(`silotech_parallel_${timestamp}`, signature)
}