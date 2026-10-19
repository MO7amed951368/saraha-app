import { redisClient } from "../clients/redis.client.js"

export const get = (key) => {
    return redisClient.get(key)
}
export const set = ({ key, value, options }) => {
    return redisClient.set(key, value, options)
}

export const del = (key) => {
    return redisClient.del(key)
}
export const TTl = (key) => {
    return redisClient.ttl(key)
}
export const expire = (key, expireIn) => {
    return redisClient.expire(key, expireIn)
}