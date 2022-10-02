const router = require('express').Router()
const User = require('../models/User')

router.post('/register', async (req, res) => {
    console.log('registaer')
    try {
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })

        const user = await newUser.save()
        return res.status(200).json(user)
    } catch (err) {
        return res.status(500).json(err)
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email})
        console.log(user)
        if(!user) return res.status(404).json('ユーザーが見つかりません')

        const failedPassword = req.body.password === user.password
        if(!failedPassword) res.status(400).json('パスワードが一致しません')

        return res.status(200).json(user)
    } catch(err) {
        return res.status(500).json(err)
    }
})


// router.get('/', (req, res) => {
//     res.send('auth router')
// })

module.exports = router