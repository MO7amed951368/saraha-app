import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import { TooManyRequestsError } from "../common/utils/errors/exeption.error.js";


export const rateLimiter = rateLimit({

  windowMs: 1 * 60 * 1000, // 15 minutes    عدد الطلبات المسموح بها لكل IP في فترة زمنية محددة
  limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes) محدد عدد الطلبات المسموح بها لكل IP في فترة زمنية محددة
  standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers بيرجع معلومات الحد من المعدل في رؤوس `RateLimit-*`
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: new TooManyRequestsError('Too many requests, please try again later.'),

  keyGenerator: (req, res) => {
    const ip = ipKeyGenerator(req.ip) // Use the IP address as the key for rate limiting
    return `${ip}_${req.originalUrl}`;// Combine the IP address and the original URL to create a unique key for each endpoint
  },
})