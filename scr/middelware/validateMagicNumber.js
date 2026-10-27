import { fileTypeFromFile } from 'file-type'
import fs from 'node:fs/promises'
import { BadRReqestError } from "../common/utils/errors/exeption.error.js"
import { allowedExtension } from "../common/constant.enum.js"

export const validateMagicNumber = async (req, res, next) => {
    // 1. تجميع الملفات سواء كانت مفردة (req.file) أو مجموعة (req.files)
    const files = req.files || (req.file ? [req.file] : [])

    if (files.length === 0) {
        return next(new BadRReqestError("No file uploaded"))
    }

    try {
        // 2. المرور على كل الملفات والفحص
        for (const file of files) {
            const filePath = file.path
            const result = await fileTypeFromFile(filePath)

            if (result && result.mime) {
                const [fileType, inputFileExtension] = result.mime.split('/')
                const isValid = allowedExtension[fileType]?.includes(inputFileExtension)

                if (!isValid) {
                    await cleanUpFiles(files) // مسح كل الملفات لو واحد بس طلع غلط
                    return next(new BadRReqestError("Invalid file content type"))
                }

                // تخزين النتيجة لكل ملف لوحده
                file.fileTypeResult = result
            } else {
                // 3. لو الملف ملوش بصمة معروفة
                await cleanUpFiles(files)
                return next(new BadRReqestError("Invalid file content type or unknown signature"))
            }
        }

        // لو كله تمام، نكمل للخطوة اللي بعدها
        next()
    } catch (error) {
        await cleanUpFiles(files)
        next(error)
    }
}

// دالة مساعدة لمسح الملفات من الـ disk لو حصل أي خطأ
async function cleanUpFiles(files) {
    for (const file of files) {
        await fs.unlink(file.path).catch(() => {})
    }
}