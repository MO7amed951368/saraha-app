import jwt from "jsonwebtoken";
import { enmRole, TokenTypeEnm } from "../constant.enum.js";
import envConfig from "../../config/env.config.js";
import { v4 as uuidv4 } from "uuid";

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
export const generatToken = (payload, secret, option) => {
    return jwt.sign(payload, secret, option)

}

export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret)
}