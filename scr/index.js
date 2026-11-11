
import "./config/env.config.js"
import express from "express";
import authRouter from "./modules/Auth/auth.controller.js";
import messageRouter from "./modules/Messages/message.controller.js";
import dbConection from "./DB/db.conecction.js";
import userRouter from "./modules/Users/user.controller.js";
import envConfig from "./config/env.config.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import { redisConnection } from "./common/clients/redis.client.js";
import helmet from "helmet";
import cors from "cors"
import { rateLimiter } from "./middlewares/rate-limiter.middelware.js";


const app = new express()
const port = envConfig.port.PORT

dbConection()
redisConnection()
//midellware function

app.use(cors(), helmet(), rateLimiter, express.json())

app.use('/uploads', express.static('uploads'))
//routers
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/message', messageRouter)

app.use('/', (req, res) => {
  res.status(200).send({ message: "Welcome to the API  " })
})
//not found end point
app.use('/', (req, res) => {
  res.status(404).send({ message: "Endpoint no found  " })
})
//error handling middelware
app.use(errorHandler)
app.listen(process.env.PORT, () => {
  console.log(`app is running on port ${process.env.PORT}`);
})



