import { Chunk } from "../database/mongo/models/Chunk";
import { Land } from "../database/mongo/models/Land";
import { GetChunksLand, CreateChunksByLand } from "./Chunk";
interface BackupLand extends Land {
    backupChunks: Chunk[]
}
export const LocalLands: BackupLand[] = []

export const AddLand = (new_land: Land) => {
    LocalLands.push({ ...new_land, backupChunks: CreateChunksByLand(new_land.landId) })
}

export const SubmitLand = (landId: string) => {
    const index = LocalLands.findIndex(land => land.landId === landId)
    if (index > -1) LocalLands[index]["backup_chunks"] = GetChunksLand(landId)
}

export const GetBackupChunkLand = (landId: string) => {
    const index = LocalLands.findIndex(land => land.landId === landId)
    if (index > -1) return LocalLands[index].backupChunks || CreateChunksByLand(landId)
    return CreateChunksByLand(landId)
}

export const GetLands = () => {
    return LocalLands.map((land) => {
        const { backupChunks, ...landWithoutBackup } = land
        return landWithoutBackup
    })
}