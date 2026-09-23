import UserRepository from "../../DB/repository/user.repository.js";
import { encrypt } from "../../utils/encryption.security.js";
import { BadRReqestError, conflictError } from "../../utils/errors/exeption.error.js";
import { compareTwoHashes, hash } from "../../utils/hash.security.js";

const userRepo = new UserRepository();

export const signup = async (body) => {
    const { firstname, lastname, email, password, gender, age, phoneNumber } = body;
    const isEmailExsist = await userRepo.findOneDocument({ email });
    if (isEmailExsist) throw new conflictError("email already exsist", 409, { duplicateEmail: email }, "EMAIL_ALREADY_EXISTS");

    let encryptedPhone;
    if (phoneNumber) encryptedPhone = encrypt(phoneNumber);

    const hashPassword = await hash(password);
    return userRepo.createNewDocument({
        firstname,
        lastname,
        email,
        password: hashPassword,
        gender,
        age,
        phoneNumber: encryptedPhone || undefined
    });
};

export const signIn = async (body) => {
    const { email, password } = body;
    const isEmailExsist = await userRepo.findOneDocument({ email });

    if (!isEmailExsist)
        throw new BadRReqestError("invalid email or password", 400, {}, "INVALID_CREDENTIALS");

    const isPasswordMatched = await compareTwoHashes(isEmailExsist.password, password);
    if (!isPasswordMatched)
        throw new BadRReqestError("invalid email or password", 400, {}, "INVALID_CREDENTIALS");

    return true;
};