import jwt from "jsonwebtoken";
import { BadRReqestError } from "./errors/exeption.error.js";
import envConfig from "../../config/env.config.js";
import UserRepository from "../../DB/repository/user.repository.js";
import { TokenTypeEnum } from "../constant.enum.js";


// const { user: userEnvConfig, admin: adminEnvConfig } = envConfig.jwt

// Utility function to generate a JWT token with the provided payload, secret, and options
// export const generatToken = async (payload, issuer) => {
//     let accessSecret
//     let refreshSecret
//     // Determine the secret key based on the role in the payload
//     let audience

//     if (payload.role === enmRole.ADMIN) {
//         accessSecret = adminEnvConfig.access_token_secret;
//         refreshSecret = adminEnvConfig.refresh_token_secret;
//         audience = enmRole.ADMIN
//     } else {
//         accessSecret = userEnvConfig.access_token_secret;
//         refreshSecret = userEnvConfig.refresh_token_secret;
//         audience = enmRole.USER
//     }
//     // Generate a unique identifier for the JWT for both access and refresh tokens
//     const jwtId = uuidv4()
//     // Generate the access token 
//     const accessToken = jwt.sign({ sub: payload._id.toString() }, accessSecret, {
//         issuer,
//         audience: [TokenTypeEnm.access, audience],
//         expiresIn: envConfig.jwt.expiration.access_token_expiration,
//         jwtid: jwtId
//     });
//     // Generate the refresh token
//     const refreshToken = jwt.sign(
//         { sub: payload._id.toString() },
//         refreshSecret,
//         {
//             issuer,
//             audience: [TokenTypeEnm.refresh, audience],
//             expiresIn: envConfig.jwt.expiration.refresh_token_expiration,
//             jwtid: jwtId
//         });

//     return { accessToken, refreshToken  };
// };


// single source of truth


const userRepo = new UserRepository
const jwtConfig = envConfig.jwt
export const generatToken = (payload, secret, option) => {
    return jwt.sign(payload, secret, option)

}

export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret)
}

export const decodeToken = ({ token, tokenType }) => {

    const data = jwt.decode(token)
    console.log({ data: data });

    if (!data.role) throw new BadRReqestError("role not found in token");


    const roleSignture = jwtConfig[data.role]

    console.log({ roleSignture: roleSignture }, { tokenType: tokenType });
    let signture;
    switch (tokenType) {
        case TokenTypeEnum.access:
            signture = roleSignture.access_token_secret
            break;
        case TokenTypeEnum.refresh:
            signture = roleSignture.refresh_token_secret
            break;
        default:
            throw new BadRReqestError("Invalid token Type");

    }

    console.log({ signture: signture });

    const decodedData = verifyToken(token, signture)

    const user = userRepo.findDocumentById(decodedData._id)
    if (!user) {
        throw new BadRReqestError("user not found");

    }
    return user

}