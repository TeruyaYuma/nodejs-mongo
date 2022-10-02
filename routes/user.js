const router = require('express').Router()
const User = require('../models/User')

router.put('/:id', async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            })
            res.status(200).json(user)

        }catch(err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json('not Authorized')
    }
})

router.delete('/:id', async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json(user)
            
        }catch(err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json('not Authorized')
    }
})

router.get('/:id', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        const {password, updatedAt, ...other} = user._doc
        res.status(200).json(other)
        
    }catch(err) {
        return res.status(500).json(err)
    }
})

//
// フォロー
//

router.put('/:id/follow', async (req, res) => {
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id)
            console.log(user)
            const currentUser = await User.findById(req.body.userId)
            console.log(currentUser)
            if(!user.follower.includes(currentUser.id)){
                await user.updateOne({
                    $push: { follower: currentUser.id}
                })
                await currentUser.updateOne({
                    $push: {following: user.id}
                })

                return res.status(200).json('follow')
            }

            return res.status(403).json('isFollow')

        }catch(err) {
            return res.status(500).json(err)
        }
    }
})

router.put('/:id/unFollow', async (req, res) => {
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)

            if(user.follower.includes(currentUser.id)){
                await user.updateOne({
                    $pull: { follower: currentUser.id}
                })
                await currentUser.updateOne({
                    $pull: {following: user.id}
                })

                return res.status(200).json('unfollow')
            }

            return res.status(403).json('isnotUnFollow')

        }catch(err) {
            return res.status(500).json(err)
        }
    }
})
// router.get('/', (req, res) => {
//     res.send('profile router')
// })

module.exports = router