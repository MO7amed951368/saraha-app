
import crypto from 'node:crypto';

const ENCRYPTION_KEY = Buffer.from(`7f3a9c2e81d64b05f2a7e93c4d8b1a60e5f9472c3a1d8e6b9f0c5a27d4e8136b`, 'hex')
const IV_LENGTH = 16;

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

