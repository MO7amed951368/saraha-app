import UserRepository from "../../DB/repository/user.repository.js";
import { encrypt } from "../../common/utils/security/encryption.security.js";
import { BadRReqestError, conflictError } from "../../common/utils/errors/exeption.error.js";
import { compareTwoHashes, hash } from "../../common/utils/security/hash.security.js";
import envConfig from "../../config/env.config.js";
import { decodeToken, generatToken } from "../../common/utils/token.utils.js";
import { set, calcTTL, get, del } from "../../common/services/redis.service.js";
import { emailVarification, TokenTypeEnum } from "../../common/constant.enum.js";
import { v4 as uuidv4 } from "uuid";
import crypto, { Hash } from 'node:crypto'
import { eventEmitter } from "../../common/services/email.service.js";

const userRepo = new UserRepository();
const { user: userEnvConfig, admin: adminEnvConfig } = envConfig.jwt
//handel varification mail with otp
const emailVerficationWithOtp = async (email) => {
    const otp = crypto.randomInt(100000, 1000000).toString()
    const hasedOtp = await hash(otp)

    eventEmitter.emit('sendMailEvent', {
        to: email,
        subject: "Email varification",
        message: ` <h1>this is code for varification</h1>
    <h2> ${otp}</h2>
    <h3>this otp valid for 5 minutes</h3>`})
    set({ key: `email_varification:${email}`, value: hasedOtp, options: { exp: emailVarification } })
}
export const signup = async (body) => {
    const { firstname, lastname, email, password, gender, age, phoneNumber, role, profileImage, profileCoversImage } = body;
    const isEmailExsist = await userRepo.findOneDocument({ email });
    if (isEmailExsist) throw new conflictError("email already exsist", 409, { duplicateEmail: email }, "EMAIL_ALREADY_EXISTS");
    let encryptedPhone;
    if (phoneNumber) encryptedPhone = encrypt(phoneNumber);

    const hashPassword = await hash(password);
    emailVerficationWithOtp(email)
    return userRepo.createNewDocument({
        firstname,
        lastname,
        email,
        password: hashPassword,
        gender,
        age,
        phoneNumber: encryptedPhone || undefined,
        role: role || 'user',
        profileImage,
        profileCoversImage
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
//confirm email 

export const confirmEmail = async (email, otp) => {
    // 1. get value of hased otp from redis
    const hasedOtp = await get(`email_varification:${email}`);

    if (!hasedOtp) {
        throw new BadRReqestError("Invalid email or your OTP expired", 400, {}, "OTP_EXPIRATION");
    }

    const isValidOtp = await compareTwoHashes(hasedOtp, String(otp));

    if (!isValidOtp) {
        throw new BadRReqestError("Invalid OTP", 400, {}, "OTP_INVALID");
    }

    await userRepo.findAndUpdateDocument({ email }, { isEmailVerified: true });
    await del(`email_varification:${email}`);

    return { verified: true };
};
//forget password
export const forgotPassword = async (email) => {
    const user = await userRepo.findOneDocument({ email });
    if (!user) {
        // For security, you can return success even if user not found to prevent email enumeration
        return { message: "If email exists, reset instructions sent" };
    }

    const resetOtp = crypto.randomInt(100000, 1000000).toString();
    const hashedResetOtp = await hash(resetOtp);
    console.log(hashedResetOtp);

    // Store in Redis with 10 minutes expiry (600 seconds)
    await set({ key: `password_reset:${email}`, value: hashedResetOtp, options: { exp: emailVarification } });

    // Send via email event
    eventEmitter.emit('sendMailEvent', {
        to: email,
        subject: "Password Reset Request",
        message: `
            <h1>Password Reset Code</h1>
            <h2>${resetOtp}</h2>
            <h3>This code is valid for 5 minutes. If you didn't request this, ignore it.</h3>
        `
    });

    return { message: "Password reset OTP sent to email" };
};

//rest password
export const resetPassword = async (email, otp, newPassword) => {
    // 1. Get stored hash from Redis
    const hashedOtp = await get(`password_reset:${email}`);
    if (!hashedOtp) {
        throw new BadRReqestError("OTP expired or invalid", 400, {}, "OTP_EXPIRATION");
    }

    // 2. Validate OTP
    const isValid = await compareTwoHashes(hashedOtp, String(otp));
    if (!isValid) {
        throw new BadRReqestError("Invalid OTP", 400, {}, "OTP_INVALID");
    }

    // 3. Hash new password
    const hashedPassword = await hash(newPassword);

    // 4. Update database with new password
    await userRepo.findAndUpdateDocument({ email }, { password: hashedPassword });

    // 5. Clean up Redis token
    await del(`password_reset:${email}`);

    return { message: "Password reset successfully" };
};
// resend otp

export const resendEmailOtp = async (email) => {
    // 1. Check if the user exists
    const user = await userRepo.findOneDocument({ email });
    if (!user) {
        throw new BadRReqestError("User not found", 404, {}, "USER_NOT_FOUND");
    }

    if (user.isEmailVerified) {
        throw new BadRReqestError("Email is already verified", 400, {}, "ALREADY_VERIFIED");
    }

    // 2. Generate a new 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = await hash(otp);

    // 3. Overwrite the old OTP in Redis with a fresh 5-minute expiry (300 seconds)
    await set({ key: `password_reset:${email}`, value: hashedOtp, options: { exp: emailVarification } });


    // 4. Trigger your existing mail event
    eventEmitter.emit('sendMailEvent', {
        to: email,
        subject: "Resend Email Verification Code",
        message: `
            <h1>New Verification Code</h1>
            <h2>${otp}</h2>
            <h3>This OTP is valid for 5 minutes</h3>
        `
    });

    return { message: "OTP resent successfully" };
};