import express from "express";
import authRouter from "./modules/Auth/auth.controller.js";
import messageRouter from "./modules/Messages/message.controller.js";
import dbConection from "./DB/db.conecction.js";
import userRouter from "./modules/Users/user.controller.js";
const app = new express()
const port = 5000

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
app.use((err, req, res, next) => {
    res.status(500).send({ message: 'internal server error', error: 'err.message' })
})
app.listen(port, () => {
    console.log(`app is running on port ${port}`);

})