import { Chunk } from "../database/mongo/models/Chunk";
import { Land } from "../database/mongo/models/Land";
import { local_get_land_number } from "../server/fastify/handler/set_land_number";
import { GetChunksLand, CreateInitChunksByLand } from "./Chunk";
interface BackupLand extends Land {
    backupChunks: Chunk[]
}
export const LocalLands: BackupLand[] = []

export const AddLand = (new_land: Land) => {
    const { landId, x1, x2, y1, y2 } = new_land
    LocalLands.push({ ...new_land, backupChunks: CreateInitChunksByLand({ landId, x1, x2, y1, y2 }) })
}

export const createFakeLand = (index: number) => {
    const landName = `FAKE LAND ${index}`
    const x1 = 20 * (index)
    const y1 = 20 * (index)
    const z1 = -2
    const x2 = 20 * (index + 1)
    const y2 = 20 * (index + 1)
    const z2 = 4
    const fake_land: Land = {
        landId: index.toString(),
        landName,
        nftHash: "0x" + Buffer.from(landName).toString("hex"),
        mapImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwaMuv62MoFnOKxAw46ItCuHRpa6qKvZLf2Q&usqp=CAU",
        landImage: "https://aws1.discourse-cdn.com/standard17/uploads/threejs/original/2X/e/e9bb644d16a6f1f8dddd51ec880dbac9f86c76f4.png",
        planetId: "0",
        owner: "",
        x1,
        y1,
        z1,
        x2,
        y2,
        z2
    }
    return { ...fake_land, backupChunks: CreateInitChunksByLand({ landId: index.toString(), x1, x2, y1, y2 }) }
}

export const SubmitLand = (landId: string) => {
    const index = LocalLands.findIndex(land => land.landId === landId)
    if (index > -1) LocalLands[index]["backup_chunks"] = GetChunksLand(landId)
}

export const GetBackupChunkLand = (landId: string) => {
    const index = LocalLands.findIndex(land => land.landId === landId)
    const { x1, x2, y1, y2 } = LocalLands[index]
    if (index > -1) return LocalLands[index].backupChunks || CreateInitChunksByLand({ landId, x1, x2, y1, y2 })
    return CreateInitChunksByLand({ landId, x1, x2, y1, y2 })
}

export const GetAllLands = () => {
    const lands: BackupLand[] = []
    const land_number = local_get_land_number()
    for (let i = 0; i < land_number; i++) {
        if (LocalLands[i]) {
            lands.push(LocalLands[i])
        } else {
            lands.push(createFakeLand(i))
        }
    }
    return lands.map((land) => {
        const { backupChunks, ...landWithoutBackup } = land
        return landWithoutBackup
    })
}

export const GetLand = (landId: string) => {
    return LocalLands.find((land) => land.landId === landId)
}