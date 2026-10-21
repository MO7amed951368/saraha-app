import UserRepository from "../../DB/repository/user.repository.js";
import { encrypt } from "../../common/utils/security/encryption.security.js";
import { BadRReqestError, conflictError } from "../../common/utils/errors/exeption.error.js";
import { compareTwoHashes, hash } from "../../common/utils/security/hash.security.js";
import envConfig from "../../config/env.config.js";
import { generatToken } from "../../common/utils/token.utils.js";
import { set } from "../../common/services/redis.service.js";

const userRepo = new UserRepository();
const { user: userEnvConfig, admin: adminEnvConfig } = envConfig.jwt

export const signup = async (body) => {
    const { firstname, lastname, email, password, gender, age, phoneNumber, role } = body;
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
        phoneNumber: encryptedPhone || undefined,
        role: role || 'user'
    });
};
//login user
export const signIn = async (body, issuer) => {
    const { email, password } = body;

    // Check if the email exists in the database
    const user = await userRepo.findOneDocument({ email });
    if (!user)
        throw new BadRReqestError("invalid email or password", 400, {}, "INVALID_CREDENTIALS");

    // Compare the provided password with the stored hashed password
    const isPasswordMatched = await compareTwoHashes(user.password, password);
    if (!isPasswordMatched)
        throw new BadRReqestError("invalid email or password", 400, {}, "INVALID_CREDENTIALS");

    // Generate JWT tokens (access and refresh) for the authenticated user
    // const tokens = await generatToken(user, issuer)

    // return tokens;
    const accessToken = generatToken(
        { _id: user._id, email: user.email, role: user.role },
        envConfig.jwt.user.access_token_secret,
        { expiresIn: "1h" }
    )
    return accessToken;

};
//logOut user 
export const logOut = async () => {
    const result = await set({ key: 'email', value: 'm.rafat@gmail.com', options: { EX: 30 } })
    return result

}