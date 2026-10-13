import envConfig from "../config/env.config.js";
import UserRepository from "../DB/repository/user.repository.js";
import { BadRReqestError, notFoundError } from "../common/utils/errors/exeption.error.js";
import { verfiyToken } from "../common/utils/token.utils.js";


const userRepo = new UserRepository()

// Middleware function to authenticate the user based on the provided access token
export const authenticate = async (req, res, next) => {
    // Extract the authorization header from the request
    const { authorization } = req.headers;
    // Check if the authorization header is present
    if (!authorization) {
        throw new BadRReqestError("Authorization header is required", 401, {}, "MISSING_TOKEN");
    }
    // Split the authorization header to extract the token
    const [prefix, token] = authorization.split(' ')
    // Check if the prefix is 'Bearer' and if the token is present
    if (prefix !== 'Bearer' || !token)
        throw new BadRReqestError("invalid authorization header format");
    // Verify the token and decode the user information
    const decodedData = verfiyToken(token, envConfig.jwt.user.access_token_secret);
    // Check if the user exists in the database based on the decoded user ID
    const user = await userRepo.findDocumentById(decodedData._id)
    // If the user is not found, throw an error indicating that the user does not exist
    if (!user) {
        throw new notFoundError("User not found", 404, {}, "USER_NOT_FOUND")
    }
    // Attach the authenticated user information to the request object for further processing
    req.authUser = user
    // Call the next middleware function in the request-response cycle
    next()

}