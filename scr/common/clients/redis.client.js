// redis connection 

// import { createClient } from "redis";
// import { redisConfig } from "../../config/redis.config.js";


// export const redisClient = createClient(redisConfig)

// export const redisConnection = async () => {
//     try {
//         await redisClient.connect()
//         console.log('redis connection success')
//     } catch (error) {

//         console.log("Redis Client Error", error)

//     }
// }
import { createClient } from "redis";
import { redisConfig } from "../../config/redis.config.js";

export const redisClient = createClient(redisConfig);

redisClient.on('error', (error) => {
    console.error('Redis Client Error:', error);
});

export const redisConnection = async () => {
    try {
        await redisClient.connect();
        console.log('Redis connection success');
    } catch (error) {
        console.log("Redis Connection Failed:", error);
    }
};
