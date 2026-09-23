import UserRepository from "../../DB/repository/user.repository.js"
import { decrypt } from "../../utils/encryption.security.js"
import { BadRReqestError } from "../../utils/errors/exeption.error.js"
const userRepo = new UserRepository()
export const getUserProfile = async (userId) => {
    if (!userId) throw new BadRReqestError('invalid userId', 400, {}, 'INVALID_USER_ID')

    const userFind = await userRepo.findDocumentById(userId)
    if (!userFind) return null

    if (userFind.phoneNumber) userFind.phoneNumber = decrypt(userFind.phoneNumber)

    return userFind
}
export const updateUser = async (body, userId) => {
    const { firstname, lastname, email, password, gender, age, phoneNumber } = body
    return await userRepo.findAndUpdateDocument(
        { _id: userId },
        { firstname, lastname, email, password, gender, age, phoneNumber },
        { new: true, runValidators: true }
    )
}

export const deleteUser = async (userId) => {
    return await userRepo.findAndDeleteDocument({ _id: userId })
}
