// import multer from "multer";
// import fs from 'node:fs'
// import crypto from 'node:crypto'
// import { allowedExtension } from "../common/constant.enum.js";
// import { BadRReqestError } from "../common/utils/errors/exeption.error.js";


// export const uploadMulter = ({ desiredPath }) => {

//     const fullDestinationPath = `uploads/${desiredPath} `
//     if (!fs.existsSync(fullDestinationPath)) {
//         fs.mkdirSync(fullDestinationPath, { recursive: true })

//     }

//     const storage = multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, fullDestinationPath)
//         },
//         filename: function (req, file, cb) {
//             const suffix = crypto.randomBytes(5).toString('hex') + Date.now()
//             cb(null, `${suffix}_${file.originalname}`)
//         }
//     })


//     const fileFilter = (req, file, cb) => {
//         const fileMimeType = file.mimetype 
//         const [fileType, inputFileExtention] = fileMimeType.split('/')
//         const fileExtentions = allowedExtension[fileType] 
//         if (fileExtentions.includes(inputFileExtention)) {
//             cb(null, true)
//         }
//         else {
//             cb(new BadRReqestError("invalid file extention"), false)
//         }
//     }
//     return multer({ fileFilter, storage })
// }

import multer from 'multer';

// Store files in memory buffer (avoids saving junk files to disk)
const storage = multer.memoryStorage();

// Optional: Filter to only allow images (adjust as needed for videos/docs)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only image files are allowed!'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {  } // Limit: 5MB max file size
});