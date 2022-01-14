import { Land } from "../database/mongo/models/Land";

export const LAND_LIST: Land[] = [
    {
        landId: "0",
        landName: "WhiteHouse",
        nftHash: "0x" + Buffer.from("WhiteHouse").toString("hex"),
        mapImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwaMuv62MoFnOKxAw46ItCuHRpa6qKvZLf2Q&usqp=CAU",
        landImage: "https://media.sketchfab.com/models/6ec9585305204f0d8af4b0ff237b9397/thumbnails/16609e5cd3414852a0b447c87081e2b2/d7cc91d916b64cc59d658126e68c81ca.jpeg",
        planetId: "0",
        owner: "",
        x1: 0,
        x2: 100,
        y1: 0,
        y2: 100,
        z1: -20,
        z2: 40
    },
    {
        landId: "1",
        landName: "GreatWall",
        nftHash: "0x" + Buffer.from("GreatWall").toString("hex"),
        mapImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwaMuv62MoFnOKxAw46ItCuHRpa6qKvZLf2Q&usqp=CAU",
        landImage: "https://i.imgur.com/v91tkIR.jpg",
        planetId: "0",
        owner: "",
        x1: 100,
        x2: 200,
        y1: 100,
        y2: 200,
        z1: -20,
        z2: 40
    },
]