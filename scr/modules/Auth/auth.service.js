import User from "../../DB/models/user.model.js";
import { encrypt } from "../../utils/encryption.security.js";
import { compareTwoHashes, hash } from "../../utils/hash.security.js";

export const signup = async (body) => {

    const { firstname, lastname, email, password, gender, age, phoneNumber } = body
    const isEmailExsist = await User.findOne({ email })
    // console.log(isEmailExsist);
    if (isEmailExsist) {

        throw new Error("email already exsist");
    }

    //encrypt phoneNumber
    let encryptedPhone;
    if (phoneNumber) encryptedPhone = encrypt(phoneNumber)
    // console.log({ encryptedPhone });
    //hashing 
    const hashPassword = await hash(password)
    return User.create({ firstname, lastname, email, password: hashPassword, gender, age, phoneNumber: encryptedPhone || undefined })

}

export const signIn = async (body) => {
    const { email, password } = body
    const isEmailExsist = await User.findOne({ email })
    if (!isEmailExsist)
        throw new Error("invalid email or password")
    const isPasswordMatched = await compareTwoHashes(isEmailExsist.password, password)




    return true
}