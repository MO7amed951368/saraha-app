import multer from "multer";
import fs from 'node:fs'
import crypto from 'node:crypto'
import { allowedExtension } from "../common/constant.enum.js";
import { BadRReqestError } from "../common/utils/errors/exeption.error.js";


export const uploadMulter = ({ desierdPath }) => {

    const fullDestinationPath = `uploads/${desierdPath} `
    if (!fs.existsSync(fullDestinationPath)) {
        fs.mkdirSync(fullDestinationPath, { recursive: true })

    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, fullDestinationPath)
        },
        filename: function (req, file, cb) {
            const suffix = crypto.randomBytes(5).toString('hex') + Date.now()
            cb(null, `${suffix}_${file.originalname}`)
        }
    })


    const fileFilter = (req, file, cb) => {
        const fileMimeType = file.mimetype 
        const [fileType, inputFileExtention] = fileMimeType.split('/')
        const fileExtentions = allowedExtension[fileType] 
        if (fileExtentions.includes(inputFileExtention)) {
            cb(null, true)
        }
        else {
            cb(new BadRReqestError("invalid file extention"), false)
        }
    }
    return multer({ fileFilter, storage })
}