import { Router } from "express";
import * as AuthService from './auth.service.js'
import { loginSchema, registerSchema } from "./auth.valadation.js";
import { BadRReqestError } from "../../common/utils/errors/exeption.error.js";
const authRouter = Router()


//register user
authRouter.post('/register', async (req, res) => {
    // Validate the request body against the register schema
    const validateRusult = registerSchema.validate(req.body, { abortEarly: false })
    if (validateRusult.error) {
        throw new BadRReqestError("validation error", 400, { validationError: validateRusult.error.details }, "VALIDATION_ERROR")
    }
// Call the signup service to create a new user
    const result = await AuthService.signup(validateRusult.value)
    res.status(201).json({ message: 'user signup succssfuly', user: result })
})

//login user
authRouter.post('/login', async (req, res) => {
    // Validate the request body against the login schema
    const validateRusult = loginSchema.validate(req.body, { abortEarly: false })
    if (validateRusult.error) {
        throw new BadRReqestError("validation error", 400, { validationError: validateRusult.error.details }, "VALIDATION_ERROR")
    }
    // Call the signIn service to authenticate the user and generate an access token
    const user = await AuthService.signIn(validateRusult.value,`${req.protocol}://${req.host}`)
    res.status(200).json({ message: 'user login successfuly ', data: user })


})
export default authRouter