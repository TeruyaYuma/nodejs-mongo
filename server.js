const express = require('express')
const app = express()
const userRouter = require('./routes/user')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/pose')
const testRouter = require('./routes/test')
const PORT = 5000
const mongoose = require('mongoose')
require('dotenv').config()

mongoose
    .connect(process.env.MONGOURL)
    .then(() => {
        console.log('DB接続中。。。')
    })
    .catch((err) => {
        console.log(err)
    })

app.use(express.json())
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/post', postRouter)
app.use('/api/test', testRouter)

app.get('/', (req, res) => {
    res.send('hello express')
})

app.listen(PORT, () => console.log('サーバーが起動しました'))