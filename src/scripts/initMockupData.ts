import { Box, BoxType } from "../database/mongo/models/Answer"
import { UnboxHistory } from "../database/mongo/models/Question"
import { boxes, connectMongo, history_unbox } from "../database/mongo/mongo"
import { createRunePackArray } from "../tool/utils"
const DataTestBox: Box[] = [
    {
        box_id: "1",
        box_type: BoxType.golden,
        txid: "txid1",
        owner: "admin",
        buyer: "admin",
        create_time: new Date(),
        isUnbox: true
    },
    {
        box_id: "2",
        box_type: BoxType.platinum,
        txid: "txid2",
        owner: "admin",
        buyer: "admin",
        create_time: new Date(),
        isUnbox: false
    },
    {
        box_id: "3",
        box_type: BoxType.diamond,
        txid: "txid3",
        owner: "admin",
        buyer: "admin",
        create_time: new Date(),
        isUnbox: false
    },
    {
        box_id: "4",
        box_type: BoxType.golden,
        txid: "txid4",
        owner: "admin2",
        buyer: "admin2",
        create_time: new Date(),
        isUnbox: false
    },
    {
        box_id: "5",
        box_type: BoxType.platinum,
        txid: "txid5",
        owner: "admin2",
        buyer: "admin2",
        create_time: new Date(),
        isUnbox: false
    },
    {
        box_id: "6",
        box_type: BoxType.platinum,
        txid: "txid6",
        owner: "admin2",
        buyer: "admin2",
        create_time: new Date(),
        isUnbox: true
    },
]

const DataTestHistoryUnbox: UnboxHistory[] = [
    {
        box_id: "1",
        box_type: BoxType.golden,
        txid: "unbox_txid1",
        box_opener: "admin",
        reward: createRunePackArray([
            { runeId: 10, quantity: 10 }
        ]),
        unbox_time: new Date()
    },
    {
        box_id: "6",
        box_type: BoxType.platinum,
        txid: "unbox_txid6",
        box_opener: "admin2",
        reward: createRunePackArray([
            { runeId: 10, quantity: 10 }
        ]),
        unbox_time: new Date()
    }
]



const initMockupData = async () => {
    try {
        await connectMongo()
        await boxes.insertMany(DataTestBox)
        await history_unbox.insertMany(DataTestHistoryUnbox)
        console.log("OK")
    } catch (e: any) {
        console.log(Object.keys(e))
        console.log(e)
    }
}

initMockupData()
