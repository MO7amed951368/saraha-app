
import bcrypt from "bcrypt"
export const hash = (text) => {
    return bcrypt.hash(text, 10)
}
export const compareTwoHashes = (hash, text) => {
    return bcrypt.compare(text, hash)
}