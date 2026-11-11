import dotenv from 'dotenv'

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
            access_token_expiration: process.env.USER_ACCESS_TOKEN_EXPIRATION,
            refresh_token_secret: process.env.USER_REFRESH_TOKEN_SECRET,
            refresh_token_expiration: process.env.USER_REFRESH_TOKEN_EXPIRATION

        },
        admin: {
            access_token_secret: process.env.ADMIN_ACCESS_TOKEN_SECRET,
            access_token_expiration: process.env.ADMIN_ACCESS_TOKEN_EXPIRATION,
            refresh_token_secret: process.env.ADMIN_REFRESH_TOKEN_SECRET,
            refresh_token_expiration: process.env.ADMIN_REFRESH_TOKEN_EXPIRATION
        }


    },
    redis: {
        url: process.env.REDIUS_URL
    },
    email: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }

}

export default envConfig