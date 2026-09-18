import { Router } from "express";
const messageRouter = new Router()
messageRouter.get('/helth', (req, res) => {
    res.send('hello message service')
})
export default messageRouter