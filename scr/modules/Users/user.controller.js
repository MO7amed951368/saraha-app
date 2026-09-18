import { Router } from "express";
import * as userService from './user.service.js'

const userRouter = new Router()
// get profile data
userRouter.get('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const profileDataUser = await userService.getUserProfile(userId);
        if (!profileDataUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Data fetched successfully', data: profileDataUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

//update user

userRouter.patch('/update/:userId', async (req, res) => {
    const { firstname, lastname, email, password, gender, age,phoneNumber } = req.body;
    const { userId } = req.params
    const userUpdate = await userService.updateUser({ firstname, lastname, email, password, gender, age,phoneNumber }, userId)
    res.status(200).json({ messsage: 'user update succsesfuly ', data: userUpdate })

})

// delete User
userRouter.delete('/delete/:userId', async (req, res) => {
    const { userId } = req.params
    const deleteUser = await userService.deleteUser(userId)
    res.status(200).json({ messsage: 'user deleted succsesfuly ', data: deleteUser })



})
export default userRouter