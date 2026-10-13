import dotenv, { parse } from 'dotenv'

dotenv.config({ path: process.env.NODE_ENV ? `.${process.env.NODE_ENV}.env` : '.env' })

const envConfig = {
    dataBase: {
        URI: process.env.DB_URI_LOCAL
    },
    encryption: {
        ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
        IV: parseInt(process.env.IV_LENGTH)
    },
    port: {
        PORT: process.env.PORT
    },
    jwt: {
        user: {
            access_token_secret: process.env.USER_ACCESS_TOKEN_SECRET,
            refresh_token_secret: process.env.USER_REFRESH_TOKEN_SECRET,
        },
        admin: {
            access_token_secret: process.env.ADMIN_ACCESS_TOKEN_SECRET,
            refresh_token_secret: process.env.ADMIN_REFRESH_TOKEN_SECRET,
        },
        expiration: {
            access_token_expiration: process.env.ACCESS_TOKEN_EXPIRATION,
            refresh_token_expiration: process.env.REFRESH_TOKEN_EXPIRATION
        }

    }
}

export default envConfig