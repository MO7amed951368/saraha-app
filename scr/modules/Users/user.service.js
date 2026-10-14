import { hash } from "argon2";
import UserRepository from "../../DB/repository/user.repository.js";
import { decrypt, encrypt } from "../../common/utils/security/encryption.security.js";
import { generatToken } from "../../common/utils/token.utils.js";
const userRepo = new UserRepository()


export const getUserProfile = async (user) => {
    if (user.phoneNumber) user.phoneNumber = decrypt(user.phoneNumber);
    return user;

}

export const getAllUsers = async () => {
    return await userRepo.findAllDocuments()
}
export const updateUser = async (body) => {
    const { firstname, lastname, email, password, gender, age, phoneNumber, role } = body
    const updateFields = Object.fromEntries(
        Object.entries({ firstname, lastname, email, gender, age, role })
            .filter(([, value]) => value !== undefined)
    )

    if (password !== undefined) updateFields.password = await hash(password);
    if (phoneNumber) updateFields.phoneNumber = encrypt(phoneNumber);

    return await userRepo.findAndUpdateDocument(
        { _id: userId },
        updateFields,
        { new: true, runValidators: true }
    )
}

export const deleteUser = async (id) => {
    return await userRepo.findAndDeleteDocument(id)
}
//rotate token
export const rotateToken = async (user, issuer) => {
    const tokens = await generatToken(user, issuer)

    return tokens;
}
