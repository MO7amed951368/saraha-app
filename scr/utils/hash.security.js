import * as argon2 from "argon2"
export const hash = (text) => {
    return argon2.hash(text)
}
export const compareTwoHashes = (hash, text) => {
    return argon2.verify(hash, text)
}