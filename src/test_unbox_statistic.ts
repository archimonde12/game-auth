
import { connectWeb3, web3 } from "./blockchain/bsc"
import { writeFile } from "./tool/file-system"
import { OpenBox } from "./unbox_result_engine"

enum BOX_WEIGHT {
    Paranium = 2200000,
    Pythium = 665000,
    Crypton = 259200,
    Onixius = 105800,
    Gem = 28220,
    Metal = 7800,
    Crystal = 2200,
    Plastic = 630,
    Rubber = 180,
    Wood = 50,
    Stone = 15,
    Soil = 1,
}
type BoxResult = {
    boxId: number
    box_name: string
    n1: number
    n2: number
    n3: number
    n1_rune: string
    n2_rune: string
    n3_rune: string
}
const ITEMS: string[] = [
    "Paranium",
    "Pythium",
    "Crypton",
    "Onixius",
    "Gem",
    "Metal",
    "Crystal",
    "Plastic",
    "Rubber",
    "Wood",
    "Stone",
    "Soil",
]
const BEAUTY_NUMBER = [
    "0000",
    "1111",
    "2222",
    "3333",
    "4444",
    "5555",
    "6666",
    "7777",
    "8888",
    "9999",
    "1986",
    "1990",
    "1991",
    "1992",
    "1993",
    "1994",
    "1995",
    "1996",
    "1997",
    "1998",
    "1999",
    "2000",
    "6868",
    "8686",
]

const generateDefaultResult = () => {
    const default_result: any = {
        Total: 0,
    }
    for (let item of ITEMS) {
        default_result[item] = 0
    }
    return default_result
}

const isBeautyAddress = (address: string) => {
    const four_last_string = address.substring(62)
    if (BEAUTY_NUMBER.includes(four_last_string)) return true
    return false
}
const getRandomAddress = () => {
    const account = web3.eth.accounts.create()
    if (isBeautyAddress(account.address)) console.log(`This is beauty address: ${account}`)
    return account.address
}
var randomstring = require("randomstring")
const getRandomBlockHash = () => {
    return web3.utils.sha3(randomstring.generate()) || ""
}

const getProbsFromResult = (simple_result: any) => {
    const probs: any = {}
    const all_fields = Object.keys(simple_result)
    all_fields.forEach((field) => {
        if (field !== "Total") {
            probs[field] = ((simple_result[field] / simple_result.Total) * 100).toFixed(6) + " %"
        }
    })
    return probs
}
const GetSimpleResult = (result: BoxResult[]) =>
    result.reduce((prev, result) => {
        const { n1, n2, n3, n1_rune, n2_rune, n3_rune } = result
        prev[n1_rune] += n1
        prev[n2_rune] += n2
        prev[n3_rune] += n3
        prev.Total += n1 + n2 + n3
        return prev
    }, generateDefaultResult())
const GetProbRune = (result: BoxResult[]) =>
    result.reduce((prev, result) => {
        const { n1_rune, n2_rune, n3_rune } = result
        prev[n1_rune] += 1
        prev[n2_rune] += 1
        prev[n3_rune] += 1
        prev.Total += 3
        return prev
    }, generateDefaultResult())

const GetTotalBoxWeight = (result: BoxResult[]) =>
    result.reduce((total_box_weight, result) => {
        const { n1, n2, n3, n1_rune, n2_rune, n3_rune } = result
        return total_box_weight + BOX_WEIGHT[n1_rune] * n1 + BOX_WEIGHT[n2_rune] * n2 + BOX_WEIGHT[n3_rune] * n3
    }, 0)

export const RandomUnbox = async (times: number) => {
    console.time("RandomUnbox")
    if (!web3) await connectWeb3("")
    const result: {
        box_type: number
        times: number
        avg_total_rune: number
        result: any
        probs: any
        chance: any
        total_box_weight: number
        avg_box_weight: number
    }[] = []
    for (let box_type = 0; box_type < 3; box_type++) {
        let open_box_results: BoxResult[] = []
        for (let i = 0; i < times; i++) {
            const address = getRandomAddress()
            const unbox_blockhash = getRandomBlockHash()
            const buybox_blockHash = getRandomBlockHash()
            const box_id = ~~(Math.random() * 20000)
            open_box_results.push(OpenBox(address, unbox_blockhash, buybox_blockHash, box_id, box_type))
        }
        const simple_result = open_box_results.reduce((prev, result) => {
            const { n1, n2, n3, n1_rune, n2_rune, n3_rune } = result
            prev[n1_rune] += n1
            prev[n2_rune] += n2
            prev[n3_rune] += n3
            prev.Total += n1 + n2 + n3
            return prev
        }, generateDefaultResult())
        const prob_result = GetProbRune(open_box_results)
        const total_box_weight = GetTotalBoxWeight(open_box_results)
        result.push({
            box_type,
            times,
            result: simple_result,
            total_box_weight,
            avg_box_weight: ~~(total_box_weight / times),
            avg_total_rune: ~~(simple_result.Total / times),
            probs: getProbsFromResult(simple_result),
            chance: getProbsFromResult(prob_result),
        })
    }
    writeFile(`./${new Date().getTime()}_result_${times}_.json`, JSON.stringify(result))
    console.timeEnd("RandomUnbox")
}

const start = async () => {
    console.time('unbox')
    await  RandomUnbox(28000)
    console.timeEnd("unbox")
}

start()
