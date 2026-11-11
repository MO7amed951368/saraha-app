import { BadRReqestError } from "../common/utils/errors/exeption.error.js";
import { decodeToken } from "../common/utils/token.utils.js";
import { TokenTypeEnum } from "../common/constant.enum.js";

export const decodedRefreshToken = async (req, res, next) => {

    const { refreshtoken } = req.headers

    if (!refreshtoken) {
        throw new BadRReqestError("refreshtoken header is missing");
    }

    const [prefix, token] = refreshtoken.split(" ");
    if (prefix !== "Bearer" || !token) {
        throw new BadRReqestError("Invalid token format", 401, {}, "INVALID_TOKEN");
    }

    const { tokenData } = await decodeToken({ token, tokenType: TokenTypeEnum.refresh })

    req.refreshTokenData = tokenData
    next()

}