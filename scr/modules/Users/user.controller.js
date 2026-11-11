import { Router } from "express";
import * as userService from './user.service.js'
import { paramsSchema } from "./user.validation.js";
import { BadRReqestError } from "../../common/utils/errors/exeption.error.js";

import { authorize } from "../../middlewares/authorization.middelware.js";
import { roleEnum } from "../../common/constant.enum.js";
import { authenticate } from "../../middlewares/authentication.middelware.js";
import { upload } from "../../middlewares/multer.middelware.js";
import { validateMagicNumber } from "../../middlewares/validateMagicNumber.js";
import { uploadToCloudinary } from "../../middlewares/cloudinaryMiddleware.js";
import { uploadMultipleToCloudinary } from "../../middlewares/cloudinaryCoverMiddleware.js";

const userRouter = new Router()
// get profile data
userRouter.get('/profile', authenticate, authorize([roleEnum.ADMIN, roleEnum.USER]), async (req, res, next) => {
    const validateRusult = paramsSchema.validate(req.params.value)
    if (validateRusult.error) {
        throw new BadRReqestError("validation error", 400, { validationError: validateRusult.error.details }, "VALIDATION_ERROR")
    }
    const profileDataUser = await userService.getUserProfile(req.authUser);

    res.status(200).json({ message: 'Data fetched successfully', data: profileDataUser });

});

// get all user 
userRouter.get('/', authenticate, authorize([roleEnum.ADMIN]), async (req, res) => {
    const result = await userService.getAllUsers()
    res.status(200).json({ message: "user retrived successfuly ", data: result })

})
//update user

userRouter.patch('/update', authorize([roleEnum.USER]), async (req, res, next) => {
    try {
        const { firstname, lastname, email, password, gender, age, phoneNumber, role } = req.body;
        const result = await userService.updateUser({ firstname, lastname, email, password, gender, age, phoneNumber, role }, req.authUser._id)
        res.status(200).json({ message: 'user update succsesfuly ', data: result })
    } catch (err) {
        next(err)
    }
})

// delete User
userRouter.delete('/delete', authenticate, authorize([roleEnum.ADMIN, roleEnum.USER]), async (req, res) => {
    const deleteUser = await userService.deleteUser(req.authUser)
    res.status(200).json({ messsage: 'user deleted succsesfuly ', data: deleteUser })



})
// upload profile picture
userRouter.patch('/upload', authenticate, upload.single('image'), validateMagicNumber, uploadToCloudinary, async (req, res, next) => {
    if (!req.file) {
        throw new BadRReqestError("Please upload a profile picture");
    }
    
    if (!req.cloudinaryResult) {
        throw new BadRReqestError("Cloudinary upload failed");
    }

    const { authUser } = req;
    
    // Pass ONLY the URL string, not the file object!
    const result = await userService.uploadProfilePicture(authUser, req.cloudinaryResult.url);
    
    res.status(200).json({ message: 'Profile picture uploaded successfully', data: result });
});
// upload cover picture
userRouter.patch(
    '/upload-cover', 
    authenticate, 
    upload.array('images', 5),          // 1. Multer parses up to 5 files into req.files
    validateMagicNumber,                // 2. Validates magic numbers of buffers in req.files
    uploadMultipleToCloudinary,         // 3. Uploads valid buffers to Cloudinary
    async (req, res, next) => {
        if (!req.cloudinaryResults || req.cloudinaryResults.length === 0) {
            throw new BadRReqestError("Please upload cover pictures"); 
        }

        const { authUser } = req;
        
        // Extract ONLY the URL strings from Cloudinary's response
        const coverUrls = req.cloudinaryResults.map(item => item.url);

        // Pass the array of strings to the service
        const result = await userService.uploadProfileCover(authUser, coverUrls);
        
        res.status(200).json({ 
            message: 'Profile covers uploaded successfully', 
            data: result 
        });
    }
);
export default userRouter