import { IndexDescription } from "mongodb";

export type Chunk = {
    chunkId: string
    x: number,
    y: number,
    z: number,
    blockTypes: string[]
    blocks: number[][]
}

export const ChunkIndexes: IndexDescription[] = [
    { key: { blockId: 1 }, unique: true, background: true },
    { key: { blockName: 1 }, background: true },
    { key: { lampColor: 1 }, background: true },
    { key: { quantity: 1 }, background: true },
    { key: { faceType: 1 }, background: true },
]




