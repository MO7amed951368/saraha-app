import UserRepository from "../DB/repository/user.repository.js";
import { BadRReqestError } from "../common/utils/errors/exeption.error.js";
import { decodeToken } from "../common/utils/token.utils.js";
import { TokenTypeEnum } from "../common/constant.enum.js";

const userRepo = new UserRepository()

export const authenticate = async (req, res, next) => {

    const { authorization } = req.headers

    if (!authorization) {
        throw new BadRReqestError("autherrization header is missing");
    }

    const [prefix, token] = authorization.split(" ");
    if (prefix !== "Bearer" || !token) {
        throw new BadRReqestError("Invalid token format", 401, {}, "INVALID_TOKEN");
    }

    const { user, tokenData } = await decodeToken({ token, tokenType: TokenTypeEnum.access })
    req.authUser = user
    req.accessTokenData = tokenData
    next()

}