import UserRepository from "../../DB/repository/user.repository.js";
import { encrypt } from "../../utils/security/encryption.security.js";
import { BadRReqestError, conflictError } from "../../utils/errors/exeption.error.js";
import { compareTwoHashes, hash } from "../../utils/security/hash.security.js";
import envConfig from "../../config/env.config.js";
import { generatToken } from "../../utils/token.utils.js";

const userRepo = new UserRepository();

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
export const signIn = async (body) => {
    const { email, password } = body;

// Check if the email exists in the database
    const isEmailExsist = await userRepo.findOneDocument({ email });
    if (!isEmailExsist)
        throw new BadRReqestError("invalid email or password", 400, {}, "INVALID_CREDENTIALS");

// Compare the provided password with the stored hashed password
    const isPasswordMatched = await compareTwoHashes(isEmailExsist.password, password);
    if (!isPasswordMatched)
        throw new BadRReqestError("invalid email or password", 400, {}, "INVALID_CREDENTIALS");

    // Generate access token
    const accessToken = generatToken(
        // Payload containing user ID, email, and role
        { _id: isEmailExsist._id, email: isEmailExsist.email, role: isEmailExsist.role },
        envConfig.jwt.user.access_token_secret,
        { expiresIn: '1h' }
    );
    return { Message: "login successfuly", accessToken };
};