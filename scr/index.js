
import "./config/env.config.js"
import express from "express";
import authRouter from "./modules/Auth/auth.controller.js";
import messageRouter from "./modules/Messages/message.controller.js";
import dbConection from "./DB/db.conecction.js";
import userRouter from "./modules/Users/user.controller.js";
import envConfig from "./config/env.config.js";
import errorHandler from "./middelware/errorMiddleware.js";
const app = new express()
const port = envConfig.port.PORT

dbConection()
//midellware function
app.use(express.json())
//routers
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/message', messageRouter)


//not found end point
app.use((req, res) => {
    res.status(404).send({ message: "Endpoint no found  " })
})
//error handling middelware
app.use(errorHandler)
app.listen(port, () => {
    console.log(`app is running on port ${port}`);

})