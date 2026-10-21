import envConfig from "../config/env.config.js";
import UserRepository from "../DB/repository/user.repository.js";
import { BadRReqestError, notFoundError } from "../common/utils/errors/exeption.error.js";
import jwt from "jsonwebtoken";
import { AudienceEnm, TokenTypeEnm } from "../common/constant.enum.js";
import { verifyToken } from "../common/utils/token.utils.js";

const userRepo = new UserRepository()
// Middleware function to authenticate users based on their JWT tokens
// export const authenticate = (tokenType = TokenTypeEnm.access) => {
//     return async (req, res, next) => {
//         // Get the (authorization header=token) from the request
//         const authorization = req.headers.authorization;
//         if (!authorization) {
//             throw new BadRReqestError("Token is required", 401, {}, "MISSING_TOKEN");
//         }
//         const [prefix, token] = authorization.split(" ");
//         if (prefix !== "Bearer" || !token) {
//             throw new BadRReqestError("Invalid token format", 401, {}, "INVALID_TOKEN");
//         }
//         //2-decoded data
//         const decodedData = jwt.decode(token);
//         console.log(decodedData);

//         if (!decodedData) {
//             throw new BadRReqestError("Invalid token", 401, {}, "INVALID_TOKEN");
//         }
//         const [decodedTokenType, audienceType] = decodedData.aud;
//         //3- check if the token type matches the expected token type
//         if (decodedTokenType !== tokenType) {
//             throw new BadRReqestError("Invalid token type", 401, {}, "INVALID_TOKEN_TYPE");

//         }
//         //4-verify
//         let secret
//         if (audienceType == AudienceEnm.admin) {
//             secret =
//                 tokenType == TokenTypeEnm.access
//                     ? envConfig.jwt.admin.access_token_secret : envConfig.jwt.admin.refresh_token_secret
//         }
//         else {
//             secret = tokenType == TokenTypeEnm.access
//                 ? envConfig.jwt.user.access_token_secret : envConfig.jwt.user.refresh_token_secret
//         }
//         const verifyData = jwt.verify(token, secret)
//         if (!verifyData) {
//             throw BadRReqestError("Invalid Signature", 401, {})
//         }
//         const user = await userRepo.findOneDocument({ _id: decodedData.sub })
//         if (!user) {
//             throw new notFoundError("User not found", 404, {}, "USER_NOT_FOUND")
//         }
//         req.authUser = user
//         req.accessTokenData = decodedData

//         next()
//     }
// }



export const authenticate = async (req, res, next) => {

    const { authorization } = req.headers

    if (!authorization) {
        throw new BadRReqestError("autherrization header is missing");
    }

    const [prefix, token] = authorization.split(" ");
    if (prefix !== "Bearer" || !token) {
        throw new BadRReqestError("Invalid token format", 401, {}, "INVALID_TOKEN");
    }
    const decodedData = verifyToken(token, envConfig.jwt.user.access_token_secret)

    const user = await userRepo.findDocumentById(decodedData._id)
    if (!user) {
        throw new BadRReqestError("user not found");

    }
    req.authUser = user
    next()

}