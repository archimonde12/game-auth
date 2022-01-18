import { IndexDescription } from "mongodb";


export type Planet = {
    planetId: string
    planetName: string
    planetType: number
}

export const PlanetIndexes: IndexDescription[] = [
    { key: { planetType: 1 }, unique: true, background: true },
    { key: { planetName: 1 }, background: true },
    { key: { planetId: 1 }, background: true },
]




