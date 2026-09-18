import User from "../../DB/models/user.model.js"
import { decrypt } from "../../utils/encryption.security.js"

export const getUserProfile = async (userId) => {

    const userF = await User.findById(userId)
    if (userF.phoneNumber) userF.phoneNumber = decrypt(userF.phoneNumber)
    return userF
}
export const updateUser = async (body, userId) => {
    const { firstname, lastname, email, password, gender, age, phoneNumber } = body
    return await User.updateOne({ _id: userId }, { firstname, lastname, email, password, gender, age, phoneNumber })
}

export const deleteUser = async (userId) => {
    return User.findByIdAndDelete(userId)
}
