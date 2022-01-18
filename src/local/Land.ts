import { Chunk } from "../database/mongo/models/Chunk";
import { Land } from "../database/mongo/models/Land";
import { GetChunksLand, CreateChunksByLand } from "./Chunk";
interface BackupLand extends Land {
    backupChunks: Chunk[]
}
export const LocalLands: BackupLand[] = []

export const AddLand = (new_land: Land) => {
    const { landId, x1, x2, y1, y2 } = new_land
    LocalLands.push({ ...new_land, backupChunks: CreateChunksByLand({ landId, x1, x2, y1, y2 }) })
}

export const SubmitLand = (landId: string) => {
    const index = LocalLands.findIndex(land => land.landId === landId)
    if (index > -1) LocalLands[index]["backup_chunks"] = GetChunksLand(landId)
}

export const GetBackupChunkLand = (landId: string) => {
    const index = LocalLands.findIndex(land => land.landId === landId)
    const { x1, x2, y1, y2 } = LocalLands[index]
    if (index > -1) return LocalLands[index].backupChunks || CreateChunksByLand({ landId, x1, x2, y1, y2 })
    return CreateChunksByLand({ landId, x1, x2, y1, y2 })
}

export const GetAllLands = () => {
    return LocalLands.map((land) => {
        const { backupChunks, ...landWithoutBackup } = land
        return landWithoutBackup
    })
}

export const GetLand = (landId: string) => {
    return LocalLands.find((land) => land.landId === landId)
}