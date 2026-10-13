import { hash } from "argon2";
import UserRepository from "../../DB/repository/user.repository.js";
import { decrypt, encrypt } from "../../common/utils/security/encryption.security.js";
const userRepo = new UserRepository()


export const getUserProfile = async (user) => {
    if (user.phoneNumber) user.phoneNumber = decrypt(user.phoneNumber);
    return user;

}

export const getAllUsers = async () => {
    return await userRepo.findAllDocuments()
}
export const updateUser = async (body, userId) => {
    const { firstname, lastname, email, password, gender, age, phoneNumber, role } = body
    let encryptedPhone;
    if (phoneNumber) encryptedPhone = encrypt(phoneNumber);
    const hashPassword = await hash(password);
    return await userRepo.findAndUpdateDocument(
        { _id: userId },
        { firstname, lastname, email, password: hashPassword, gender, age, phoneNumber: encryptedPhone || undefined, role: role || 'user' },
        { new: true, runValidators: true }
    )
}

export const deleteUser = async (id) => {
    return await userRepo.findAndDeleteDocument(id)
}
