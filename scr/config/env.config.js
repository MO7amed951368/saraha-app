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
    }
}

export default envConfig