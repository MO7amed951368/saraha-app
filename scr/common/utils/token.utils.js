import jwt from "jsonwebtoken";
import { BadRReqestError, unauthorizedError } from "./errors/exeption.error.js";
import envConfig from "../../config/env.config.js";
import UserRepository from "../../DB/repository/user.repository.js";
import { TokenTypeEnum } from "../constant.enum.js";
import { get } from "../services/redis.service.js";

// single source of truth

const userRepo = new UserRepository
const jwtConfig = envConfig.jwt
export const generatToken = (payload, secret, option) => {
    return jwt.sign(payload, secret, option)

}

export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret)
}

export const decodeToken = async ({ token, tokenType }) => {

    const data = jwt.decode(token)
    // console.log({ data: data });
    if (!data.role) throw new BadRReqestError("role not found in token");
    // get signature based on role
    const signture = getSignuatureByRoleAndType({ role: data.role, tokenType })
    // verify token data
    const decodedData = verifyToken(token, signture)
    // check if token is black list 
    const isTokenBlackList = await get(`bl_${tokenType}_${decodedData.jti}`)
    if (isTokenBlackList) {
        throw new unauthorizedError("This token is revoked", 401, 'UNAUTHORIZE');
    }
    // get user from dataabase
    const user = await userRepo.findDocumentById(decodedData._id)
    if (!user) {
        throw new BadRReqestError("user not found");

    }
    return { user, tokenData: decodedData }

}

const getSignuatureByRoleAndType = ({ role, tokenType }) => {
    const roleSignture = jwtConfig[role]

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
    // console.log({ signture: signture });
    return signture
}