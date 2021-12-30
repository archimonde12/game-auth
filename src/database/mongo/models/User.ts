import { IndexDescription } from "mongodb";


export type User = {
    address: string
    create_at: Date
    last_login: Date
}

export const UserIndexes: IndexDescription[] = [
    { key: { address: 1 }, unique: true, background: true },
    { key: { create_at: 1 }, background: true },
]




