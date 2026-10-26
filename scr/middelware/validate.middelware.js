import { fileTypeFromFile } from 'file-type'
import fs from 'node:fs/promises'
import { BadRReqestError } from "../common/utils/errors/exeption.error.js"
import { allowedExtension } from "../common/constant.enum.js"

// export const validateMagicNumber = async (req, res, next) => {
//     if (!req.file) return next(new BadRReqestError("No file uploaded"))

//     const result = await fileTypeFromFile(req.file.path)

//     const [fileType, inputFileExtension] = result?.mime?.split('/') || []
//     const isValid = result && allowedExtension[fileType]?.includes(inputFileExtension)

//     if (!isValid) {
//         await fs.unlink(req.file.path).catch(() => {})
//         return next(new BadRReqestError("Invalid file content type"))
//     }

//     req.file.fileTypeResult = result
//     next()
// }

export const validateMagicNumber = async (req, res, next) => {

    if (!req.file)
        return next(new BadRReqestError("No file uploaded"))

    const filePath = req.file.path
    console.log(filePath);

    const result = await fileTypeFromFile(filePath)
    console.log(result);


    if (result && result.mime) {

        const [fileType, inputFileExtension] = result.mime.split('/')

        const isValid = allowedExtension[fileType]?.includes(inputFileExtension)
        console.log(isValid);

        if (!isValid) {

            await fs.unlink(filePath).catch(() => { })

            return next(new BadRReqestError("Invalid file content type"))

        }

        req.file.fileTypeResult = result

        next()

    } 

}