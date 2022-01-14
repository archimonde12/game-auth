import { Object } from "../database/mongo/models/Object";

export const LocalObjects: Object[] = []
export const UpdateObjects = (objects: Object[]) => {
    for (let object of objects) {
        const index = LocalObjects.findIndex(_object => _object.objectId === object.objectId && _object.landId === _object.landId)
        if (index > -1) { LocalObjects[index] = object }
        else {LocalObjects.push(object)}
    }
}

export const RemoveObjects = (objectIds: string[], landId: string) => {
    for (let objectId of objectIds) {
        const index = LocalObjects.findIndex(el => el.objectId === objectId && el.landId === landId)
        if (index > -1) LocalObjects.splice(index, 1)
    }
}

export const FindObjects = (params: { x: number, y: number, landId: string, r: number }) => {
    const { x, y, r, landId } = params
    const found_objects = LocalObjects.filter(object => {
        const bound_x_max = x + r
        const bound_y_max = y + r
        const bound_x_min = x - r > 0 ? x - r : 0
        const bound_y_min = y - r > 0 ? x - r : 0
        const is_in_bound = object.x >= bound_x_min && object.y >= bound_y_min && object.x <= bound_x_max && object.y <= bound_y_max
        const is_in_land = object.landId === landId
        return is_in_bound && is_in_land
    })
    return [...found_objects]
}

