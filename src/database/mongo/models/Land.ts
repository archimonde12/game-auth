import { IndexDescription } from "mongodb";


export interface Land {
    planetId: string
    landId: string
    landName: string
    nftHash: string
    mapImage: string
    landImage: string
    owner: ""
    x1: number
    y1: number
    z1: number
    x2: number
    y2: number
    z2: number
}

export const LandIndexes: IndexDescription[] = [
    { key: { landId: 1 }, unique: true, background: true },
    { key: { landName: 1 }, background: true },
    { key: { planetId: 1 }, background: true },
    { key: { nftHash: 1 }, background: true },
    { key: { mapImage: 1 }, background: true },
]




