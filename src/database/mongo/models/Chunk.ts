import { IndexDescription } from "mongodb";

export type Chunk = {
    landId: string,
    chunkId: string,
    x: number,
    y: number,
    z: number,
    blocks: number[][]
}

export const ChunkIndexes: IndexDescription[] = [
    { key: { chunkId: 1, landId: 1 }, unique: true, background: true },
    { key: { x: 1 }, background: true },
    { key: { y: 1 }, background: true },
    { key: { z: 1 }, background: true },
]




