import { Router } from "express";
import * as userService from './user.service.js'
import { paramsSchema } from "./user.validation.js";
import { BadRReqestError } from "../../common/utils/errors/exeption.error.js";

import { authorize } from "../../middelware/authorization.middelware.js";
import { roleEnum } from "../../common/constant.enum.js";
import { authenticate } from "../../middelware/authentication.middelware.js";

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
export default userRouter