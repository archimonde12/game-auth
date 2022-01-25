import { FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify"
import { getHTTPErrorCode, getTokenFromReq } from ".."
import { BlockType } from "../../../database/mongo/models/BlockType"
import { Land } from "../../../database/mongo/models/Land"
import { ErrorHandler } from "../../../tool/error_handler"
import { checkCachedToken, verifyAuthJwt } from "../../../tool/jwt"
export const BlockTypesSchema: RouteShorthandOptions = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    result: {
                        type: ['array']
                    },
                }
            }
        }
    },
}
const BLOCK_TYPES: BlockType[] = [
    {
        uniqueTypeId: "0x" + Buffer.from("default").toString("hex"),
        blockTypeId: 1,
        blockName: "default",
        lampColor: "998066",
        quantity: 999999,
        faceType: 2,
        icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVj8xhQsqWYRkmcZ0r0V9KzxQl8qXTM35-uQ&usqp=CAU",
        faces: [{
            texture: "https://media.istockphoto.com/vectors/subtle-halftone-dots-vector-texture-overlay-vector-id1163666619?k=20&m=1163666619&s=612x612&w=0&h=f07B-2n5plROeW6Vx3cVbRw00_BuXQLZxRX_IdsR6mo=",
            normals: "https://i.pinimg.com/564x/b3/d2/fd/b3d2fd54a8a44c665fd09bb6f4b7feb8--d-artist-broken-glass.jpg",
            alpha: 0.5
        }],
    },
    {
        uniqueTypeId: "0x" + Buffer.from("soil").toString("hex"),
        blockTypeId: 2,
        blockName: "soil",
        lampColor: "998066",
        quantity: 999999,
        faceType: 2,
        icon: "https://image.shutterstock.com/image-vector/ground-cube-isolated-260nw-702797671.jpg",
        faces: [{
            texture: "https://media.istockphoto.com/photos/earth-texture-macro-photography-pattern-background-picture-id1277752567?k=20&m=1277752567&s=612x612&w=0&h=fHnOc6HznYZreHs5baH5e2448U-Eua6to66qoHf05Ds=",
            normals: "https://www.researchgate.net/profile/Andreas-Junker-3/publication/344587438/figure/fig4/AS:989314339074049@1612882327388/From-left-to-right-Wind-map-Texture-and-Normal-map-The-wind-map-is-a-texture-composed.ppm",
            alpha: 0.5
        }],
    },
    {
        uniqueTypeId: "0x" + Buffer.from("stone").toString("hex"),
        blockTypeId: 3,
        blockName: "stone",
        lampColor: "ffe4e1",
        quantity: 999999,
        faceType: 2,
        icon: "https://cdn2.iconfinder.com/data/icons/cube-three/64/Shattered_stone-512.png",
        faces: [{
            texture: "https://media.istockphoto.com/photos/light-grey-black-slate-stone-background-or-texture-picture-id1164746310?k=20&m=1164746310&s=170667a&w=0&h=2zmUKpxexjSPER20VtR0spCcYtVf8cTYwK2NgF2iCfU=",
            normals: "https://thumbs.dreamstime.com/b/r-stone-wall-normal-map-computer-generated-texture-masonry-differently-sized-stones-insert-concrete-seamless-tileable-repeating-99018769.jpg",
            alpha: 0.5
        }],
    },
    {
        uniqueTypeId: "0x" + Buffer.from("wood").toString("hex"),
        blockName: "wood",
        blockTypeId: 4,
        lampColor: "",
        quantity: 999999,
        faceType: 2,
        icon: "https://cdn4.iconfinder.com/data/icons/construction-items-and-tools/200/construction_wood1-512.png",
        faces: [{
            texture: "https://media.istockphoto.com/photos/laminate-wooden-floor-texture-background-picture-id1083302826?b=1&k=20&m=1083302826&s=170667a&w=0&h=ePdma8I7u7KHs2YbehQSVcCX9qay5iPr3wynsWnzFZ0=",
            normals: "https://www.filterforge.com/filters/7851-normal.jpg",
            alpha: 0.5
        }],
    },
]

export async function getBlockTypes(req: FastifyRequest, rep: FastifyReply) {
    try {
        const token = getTokenFromReq(req)

        const tokenData = await verifyAuthJwt(token)
        await checkCachedToken(tokenData)
        rep.send({ result: BLOCK_TYPES })
    } catch (e: any) {
        ErrorHandler(e, { body: req.body }, getBlockTypes.name)
        const errorCode = getHTTPErrorCode(e)
        rep.code(errorCode)
        rep.send(e)
    }
}