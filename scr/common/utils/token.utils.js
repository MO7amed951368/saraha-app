import jwt from "jsonwebtoken";

// Utility function to generate a JWT token with the provided payload, secret, and options
export const generatToken = (payload, secret, options) => {
    return jwt.sign(payload, secret, options)

}
// Utility function to verify a JWT token using the provided secret
export const verfiyToken = (token, secret) => {
    return jwt.verify(token, secret)
}