import UserRepository from "../../DB/repository/user.repository.js";
import { encrypt } from "../../common/utils/security/encryption.security.js";
import { BadRReqestError, conflictError } from "../../common/utils/errors/exeption.error.js";
import { compareTwoHashes, hash } from "../../common/utils/security/hash.security.js";
import envConfig from "../../config/env.config.js";
import { decodeToken, generatToken } from "../../common/utils/token.utils.js";
import { set, calcTTL } from "../../common/services/redis.service.js";
import { TokenTypeEnum } from "../../common/constant.enum.js";
import { v4 as uuidv4 } from "uuid";

const userRepo = new UserRepository();
const { user: userEnvConfig, admin: adminEnvConfig } = envConfig.jwt

export const signup = async (body) => {
    const { firstname, lastname, email, password, gender, age, phoneNumber, role ,profileImage } = body;
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
        role: role || 'user',
        profileImage
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


    const accessToken = generatToken(
        { _id: user._id, email: user.email, role: user.role },
        envConfig.jwt.admin.access_token_secret,
        { expiresIn: envConfig.jwt.admin.access_token_expiration, jwtid: uuidv4() }
    )
    const refreshToken = generatToken(
        { _id: user._id, email: user.email, role: user.role },
        envConfig.jwt.admin.refresh_token_secret,
        { expiresIn: envConfig.jwt.admin.refresh_token_expiration, jwtid: uuidv4() }
    )
    return { accessToken, refreshToken };

};

//rotate token
export const rotateToken = async (userRefreshToken) => {
    const user = await decodeToken({ token: userRefreshToken, tokenType: TokenTypeEnum.refresh })
    const accessToken = generatToken(
        { _id: user._id, email: user.email, role: user.role },
        envConfig.jwt.admin.access_token_secret,
        { expiresIn: envConfig.jwt.admin.access_token_expiration, jwtid: uuidv4() }
    )
    return accessToken;
}
//logOut user 
export const logOut = async (accessTokenData, refreshTokenData) => {
    const { exp: accessExpiration, jti: accessId } = accessTokenData
    const { exp: refrehExpiration, jti: refrehId } = refreshTokenData

    const accessTTL = calcTTL(accessExpiration)

    const refreshTTL = calcTTL(refrehExpiration)

    // console.log(accessTTL, refreshTTL);

    Promise.all(

        [
            set({ key: `bl_${TokenTypeEnum.access}_${accessId}`, value: "true", options: { EX: accessTTL } }),
            set({ key: `bl_${TokenTypeEnum.refresh}_${refrehId}`, value: "true", options: { EX: refreshTTL } })
        ]
    )
    return { accessTTL, refreshTTL }

}