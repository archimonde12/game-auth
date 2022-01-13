import { IndexDescription } from "mongodb";


export type Planet = {
    planetId: string
    planetName: string
    planetType: number
}

export const PlanetIndexes: IndexDescription[] = [
    { key: { landId: 1 }, unique: true, background: true },
    { key: { landName: 1 }, background: true },
    { key: { planetId: 1 }, background: true },
    { key: { nftHash: 1 }, background: true },
    { key: { mapImage: 1 }, background: true },
]




