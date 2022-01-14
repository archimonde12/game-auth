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
        uniqueTypeId: "0x" + Buffer.from("soil").toString("hex"),
        blockName: "soil",
        lampColor: "998066",
        quantity: 999999,
        faceType: 2,
        faces: [{
            texture: "https://media.istockphoto.com/photos/earth-texture-macro-photography-pattern-background-picture-id1277752567?k=20&m=1277752567&s=612x612&w=0&h=fHnOc6HznYZreHs5baH5e2448U-Eua6to66qoHf05Ds=",
            normals: "https://www.researchgate.net/profile/Andreas-Junker-3/publication/344587438/figure/fig4/AS:989314339074049@1612882327388/From-left-to-right-Wind-map-Texture-and-Normal-map-The-wind-map-is-a-texture-composed.ppm",
            alpha: 0.5
        }],
    },
    {
        uniqueTypeId: "0x" + Buffer.from("stone").toString("hex"),
        blockName: "stone",
        lampColor: "ffe4e1",
        quantity: 999999,
        faceType: 2,
        faces: [{
            texture: "https://previews.123rf.com/images/kelifamily/kelifamily2003/kelifamily200300136/142473392-gray-stone-wall-for-the-background-gray-stone-texture.jpg",
            normals: "https://thumbs.dreamstime.com/b/r-stone-wall-normal-map-computer-generated-texture-masonry-differently-sized-stones-insert-concrete-seamless-tileable-repeating-99018769.jpg",
            alpha: 0.5
        }],
    },
    {
        uniqueTypeId: "0x" + Buffer.from("wood").toString("hex"),
        blockName: "wood",
        lampColor: "",
        quantity: 999999,
        faceType: 2,
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