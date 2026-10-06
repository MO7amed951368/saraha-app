import { Router } from "express";
import * as AuthService from './auth.service.js'
import { loginSchema, registerSchema } from "./auth.valadation.js";
import { BadRReqestError } from "../../utils/errors/exeption.error.js";
const authRouter = Router()



authRouter.post('/register', async (req, res) => {
    const validateRusult = registerSchema.validate(req.body, { abortEarly: false })
    if (validateRusult.error) {
        throw new BadRReqestError("validation error", 400, { validationError: validateRusult.error.details }, "VALIDATION_ERROR")
    }

    const result = await AuthService.signup(validateRusult.value)
    // console.log(result);

    res.status(201).json({ message: 'user signup succssfuly', user: result })
})

//login user
authRouter.post('/login', async (req, res) => {
    const validateRusult = loginSchema.validate(req.body, { abortEarly: false })
    if (validateRusult.error) {
        throw new BadRReqestError("validation error", 400, { validationError: validateRusult.error.details }, "VALIDATION_ERROR")
    }
    const user = await AuthService.signIn(validateRusult.value)
    res.status(200).json({ message: 'user login successfuly ', data: user })


})
export default authRouter