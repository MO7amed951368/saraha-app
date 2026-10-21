import { unauthorizedError } from "../common/utils/errors/exeption.error.js";




// Middleware function to authorize users based on their roles
export const authorize = (allowedRoles) => {
    return (req, res, next) => {
        const loggedInUserRole = req.authUser.role
        if (!allowedRoles.includes(loggedInUserRole)) {
            throw new unauthorizedError("You are not authorized to access this resource", 403, {}, "UNAUTHORIZED_ACCESS");
        }
        next()
    }
}


