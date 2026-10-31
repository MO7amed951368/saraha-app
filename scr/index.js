
import "./config/env.config.js"
import express from "express";
import authRouter from "./modules/Auth/auth.controller.js";
import messageRouter from "./modules/Messages/message.controller.js";
import dbConection from "./DB/db.conecction.js";
import userRouter from "./modules/Users/user.controller.js";
import envConfig from "./config/env.config.js";
import errorHandler from "./middelware/errorMiddleware.js";
import { redisConnection } from "./common/clients/redis.client.js";
import helmet from "helmet";
import cors from "cors"
import rateLimit from "express-rate-limit";
import { sendEmail } from "./common/services/email.service.js";


const app = new express()
const port = envConfig.port.PORT

dbConection()
redisConnection()
//midellware function
app.use(cors(), helmet(), express.json())
// app.use(rateLimit({

//   windowMs: 1 * 60 * 1000, // 15 minutes
//   limit: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//   standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
//   ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive

// }))
app.use('/uploads', express.static('uploads'))
//routers
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/message', messageRouter)


//not found end point
app.use('/', (req, res) => {
  res.status(404).send({ message: "Endpoint no found  " })
})
//error handling middelware
app.use(errorHandler)
app.listen(port, () => {
  console.log(`app is running on port ${port}`);

})


// try {
//   await sendEmail(
//     "mohthree1990@gmail.com",
//     "Test Email",
//     "<h1>Hello from Saraha app</h1>"
//   );
//   console.log("Server is ready to take our messages");
// } catch (err) {
//   console.error("Verification failed:", err);
// }

