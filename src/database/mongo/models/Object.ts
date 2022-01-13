import { IndexDescription } from "mongodb";

export type Object = {
    objectHash: string
    objectId: string
    x: number,
    y: number,
    z: number,
    width: number
    height: number
    depth: number
    rotateX: number
    rotateY: number
    rotateZ: number
    objectData: string
}

export const ObjectIndexes: IndexDescription[] = [
    { key: { objectHash: 1 }, unique: true, background: true },
    { key: { objectId: 1 }, background: true },
    { key: { x: 1 }, background: true },
    { key: { y: 1 }, background: true },
    { key: { z: 1 }, background: true },
]




