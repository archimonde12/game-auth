import { IndexDescription } from "mongodb";

export type BlockTexture = {
    texture: string,
    normals: string,
    alpha: number
}
export type BlockType = {
    uniqueTypeId: string
    blockTypeId: number
    icon: string
    blockName: string
    lampColor: string
    quantity: number
    faceType: number
    faces: [BlockTexture]
}

export const BlockTypeIndexes: IndexDescription[] = [
    { key: { uniqueTypeId: 1 }, unique: true, background: true },
    { key: { blockTypeId: 1 }, unique: true, background: true },
    { key: { blockName: 1 }, background: true },
    { key: { lampColor: 1 }, background: true },
    { key: { icon: 1 }, background: true },
    { key: { quantity: 1 }, background: true },
    { key: { faceType: 1 }, background: true },
]




