import fs from "fs"

export const isFileExist = (path: string) => {
    if (!path) throw new Error("path missing !!!")
    return fs.existsSync(path)
}
export const readLocalFile = (path: string) => {
    if (!path) throw new Error("path missing !!!")
    const data = fs.readFileSync(path).toString()
    const result = JSON.parse(data)
    return result
}

export const writeFile = (path: string, value: string) => {
    if (!path) throw new Error("path missing !!!")
    const writeStream = fs.createWriteStream(path)
    writeStream.write(value)
}