import { Chunk } from "../database/mongo/models/Chunk"
import { GetBackupChunkLand, GetLand } from "./Land"

export const LocalChunks: Chunk[] = []
const createChunkId = (x: number, y: number, z: number) => x.toString() + "_" + y.toString() + "_" + z.toString()
const CreateEmptyChunk = (x: number, y: number, z: number, landId: string) => {
    return { x, y, z, landId, chunkId: createChunkId(x, y, z), blocks: [] } as Chunk
}
const CreateFullChunk = (x: number, y: number, z: number, landId: string) => {
    let chunk: Chunk = { x, y, z, landId, chunkId: createChunkId(x, y, z), blocks: [] }
    for (let i = 0; i < 16; i++) {
        chunk.blocks[i] = []
        for (let j = 0; j < 16; j++) {
            chunk.blocks[i][j] = 1
        }
    }
    return chunk
}
export const CreateInitChunksByLand = (params: { landId: string, x1: number, x2: number, y1: number, y2: number, }) => {
    const { landId, x2, x1, y2, y1 } = params
    const land_length = x2 - x1
    const land_width = y2 - y1
    const chunks: Chunk[] = []
    for (let i = 0; i < land_length; i++) {
        for (let j = 0; j < land_width; j++) {
            for (let k = -2; k < 4; k++) {
                if (k > -1) {
                    const emptyChunk = CreateEmptyChunk(i, j, k, landId)
                    chunks.push(emptyChunk)
                    LocalChunks.push(emptyChunk)
                } else {
                    const fullChunk = CreateFullChunk(i, j, k, landId)
                    chunks.push(fullChunk)
                    LocalChunks.push(fullChunk)
                }
            }
        }
    }
    return chunks
}

export const GetChunks = (x: number, y: number, r: number, landId: string) => {
    const bound_x_min = r > x ? 0 : x - r
    const bound_x_max = x + r
    const bound_y_min = r > y ? 0 : y - r
    const bound_y_max = y + r
    const chunks: Chunk[] = []
    for (let i = bound_x_min; i < bound_x_max + 1; i++) {
        for (let j = bound_y_min; j < bound_y_max + 1; j++) {
            for (let k = -2; k < 4; k++) {
                const foundChunk = LocalChunks.find(chunk => chunk.chunkId === createChunkId(i, j, k) && chunk.landId === landId)
                if (foundChunk&&foundChunk.blocks.length) chunks.push(foundChunk)
            }
        }
    }
    return chunks
}

export const UpdateChunks = (chunks: Chunk[]) => {
    for (let chunk of chunks) {
        const { chunkId, landId } = chunk
        const index = LocalChunks.findIndex(el => el.chunkId === chunkId && el.landId === landId)
        LocalChunks[index] = chunk
    }
}

export const GetChunksLand = (landId: string) => {
    return LocalChunks.filter(el => el.landId === landId)
}

export const ResetChunksLand = (landId: string) => {
    const backup_data = GetBackupChunkLand(landId)
    UpdateChunks(backup_data)
}
