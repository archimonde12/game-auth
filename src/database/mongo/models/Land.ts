import { IndexDescription } from "mongodb";


export type Land = {
    id: string
    width: number
    length: number
    location: number[]
    create_at: Date
    owner_address: string
    tx_id: string
}

export const LandIndexes: IndexDescription[] = [
    { key: { id: 1 }, unique: true, background: true },
    { key: { create_at: 1 }, background: true },
    { key: { owner_address: 1 }, background: true },
    { key: { tx_id: 1 }, background: true },
]




