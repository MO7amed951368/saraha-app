
import crypto from 'node:crypto';
import envConfig from '../config/env.config.js';

const ENCRYPTION_KEY = Buffer.from(envConfig.encryption.ENCRYPTION_KEY, 'hex')
const IV_LENGTH = envConfig.encryption.IV;

export const encrypt = (plainText) => {

    const iv = crypto.randomBytes(IV_LENGTH)
    // console.log({ iv });
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);

    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`

}


// Decrypt function
export const decrypt = (cipher) => {

    const [ivHex, encryptedText] = cipher.split(':');

    const iv = Buffer.from(ivHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');

    decrypted += decipher.final('utf8');

    return decrypted;
}

