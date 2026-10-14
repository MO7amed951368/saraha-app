import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { enmRole, TokenTypeEnm } from "../constant.enum.js";
import envConfig from "../../config/env.config.js";

const { user: userEnvConfig, admin: adminEnvConfig } = envConfig.jwt

// Utility function to generate a JWT token with the provided payload, secret, and options
export const generatToken = async (payload, issuer) => {
    let accessSecret
    let refreshSecret
    // Determine the secret key based on the role in the payload
    let audience

    if (payload.role === enmRole.ADMIN) {
        accessSecret = adminEnvConfig.access_token_secret;
        refreshSecret = adminEnvConfig.refresh_token_secret;
        audience = enmRole.ADMIN
    } else {
        accessSecret = userEnvConfig.access_token_secret;
        refreshSecret = userEnvConfig.refresh_token_secret;
        audience = enmRole.USER
    }
    // Generate a unique identifier for the JWT for both access and refresh tokens
    const jwtId = randomUUID()
    // Generate the access token 
    const accessToken = jwt.sign({ sub: payload._id.toString() }, accessSecret, {
        issuer, // Set the issuer of the token
        audience: [TokenTypeEnm.access, audience], // Set the audience of the token
        expiresIn: envConfig.jwt.expiration.access_token_expiration, // Set the expiration time for the access token
        jwtid: jwtId // Set the unique identifier for the token
    });
    // Generate the refresh token
    const refreshToken = jwt.sign(
        // Payload containing the user ID for the refresh token
        { sub: payload._id.toString() },
        // Use the appropriate secret key for the refresh token
        refreshSecret,
        // Set the options for the refresh token
        {
            issuer, // Set the issuer of the token
            audience: [TokenTypeEnm.refresh, audience], // Set the audience of the token
            expiresIn: envConfig.jwt.expiration.refresh_token_expiration, // Set the expiration time for the refresh token
            jwtid: jwtId // Set the unique identifier for the token
        });

    return { accessToken, refreshToken };
};
