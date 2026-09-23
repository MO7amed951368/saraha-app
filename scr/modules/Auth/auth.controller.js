import { Router } from "express";
import * as AuthService from './auth.service.js'
const authRouter = Router()



authRouter.post('/register', async (req, res) => {

    const { firstname, lastname, email, password, gender, age, phoneNumber } = req.body
    const result = await AuthService.signup({ firstname, lastname, email, password, gender, age, phoneNumber })
    console.log(result);

    res.status(201).json({ message: 'user signup succssfuly', user: result })
})

//login user
authRouter.post('/login', async (req, res) => {

    const { email, password } = req.body
    const user = await AuthService.signIn({ email, password })
    res.status(200).json({ message: 'user login successfuly ', data: user })


})
export default authRouter