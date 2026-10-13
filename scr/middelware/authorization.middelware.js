import { unauthorizedError } from "../utils/errors/exeption.error.js";




// Middleware function to authorize users based on their roles
export const authorize =(allowedRoles)=>{
    // Return a middleware function that checks if the authenticated user's role is allowed
    return (req,res,next)=>{
        // Get the role of the authenticated user from the request object
        const loggedInUserRole=req.authUser.role
        // Check if the user's role is included in the allowed roles
        if (!allowedRoles.includes(loggedInUserRole)) {
            // If the user's role is not allowed, throw an unauthorized error with a 403 status code
            throw new unauthorizedError("You are not authorized to access this resource", 403, {}, "UNAUTHORIZED_ACCESS"); 
        }
// If the user's role is allowed, call the next middleware function in the request-response cycle
        next()
    }
}


