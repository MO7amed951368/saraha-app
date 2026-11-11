import { fileTypeFromBuffer } from 'file-type'
import { BadRReqestError } from "../common/utils/errors/exeption.error.js"
import { allowedExtension } from "../common/constant.enum.js"

export const validateMagicNumber = async (req, res, next) => {
    // Collect files whether single (req.file) or multiple (req.files)
    const files = req.files || (req.file ? [req.file] : [])

    if (files.length === 0) {
        return next(new BadRReqestError("No file uploaded"))
    }

    try {
        // Iterate through each file and check its buffer signature
        for (const file of files) {
            const buffer = file.buffer
            
            if (!buffer) {
                return next(new BadRReqestError("File buffer missing"))
            }

            // Use fileTypeFromBuffer instead of fileTypeFromFile
            const result = await fileTypeFromBuffer(buffer)

            if (result && result.mime) {
                const [fileType, inputFileExtension] = result.mime.split('/')
                const isValid = allowedExtension[fileType]?.includes(inputFileExtension)

                if (!isValid) {
                    return next(new BadRReqestError("Invalid file content type"))
                }

                // Store result for individual file if needed later
                file.fileTypeResult = result
            } else {
                // If file signature cannot be determined
                return next(new BadRReqestError("Invalid file content type or unknown signature"))
            }
        }

        // If everything is valid, proceed to the next middleware (Cloudinary)
        next()
    } catch (error) {
        next(error)
    }
}