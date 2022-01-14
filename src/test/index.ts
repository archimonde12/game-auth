import { createRunePackArray } from "../tool/utils"


const test = async () => {
    try {
        // const start = performance.now()
        // createRunePackArray([{runeId:12,quantity:20}])
        // const end = performance.now()
        // console.table({ test_time_ms: end - start })
        const text="Stone"
        console.log(Buffer.from(text).toString("hex"))
    } catch (e: any) {

    }

}

test()

