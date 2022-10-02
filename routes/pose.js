const router = require('express').Router()
const Post = require('../models/Post')
const User = require('../models/User')

//create
router.post('/', async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const post = await newPost.save()
        return res.status(200).json(post)
    }catch(err) {
        return res.status(500).json(err)
    }
})

//update
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(post && req.body.userId === post.userId){
            await post.updateOne({
                $set: req.body
            })
            return res.status(200).json(post)
        } else {
            return res.status(403).json('no post')
        }
    }catch(err) {
        console.log('err:', err)
        return res.status(500).send(err)
    }
})

//delete
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(post && req.body.userId === post.userId){
            await post.deleteOne()
            return res.status(200).json(post)
        } else {
            return res.status(403).json('no post')
        }
    }catch(err) {
        console.log('err:', err)
        return res.status(500).send(err)
    }
})

//get
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(post){
            return res.status(200).json(post)
        }

        return res.status(403).json('no post')
    }catch(err) {
        console.log('err:', err)
        return res.status(500).send(err)
    }
})

//like
router.put('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post) return res.status(403).json('no post')
        
        if(!post.likes.includes(req.body.userId)){
            const updatedPost = await post.updateOne({
                $push: {likes: req.body.userId}
            })
            return res.status(200).json('いいねした')
        }
        const updatedPost = await post.updateOne({
            $pull: {likes: req.body.userId}
        })
        return res.status(200).json('いいね外した')
    }catch(err) {
        console.log('err:', err)
        return res.status(500).send(err)
    }
})

//timeline
router.get('/timeline/:userId', async (req, res) => {
    try{
        const currentUser = await User.findById(req.params.userId)
        
        const userPosts = await Post.find({userId: currentUser._id})

        const friendPosts = await Promise.all(
            currentUser.following.map((friendId) => Post.find({userId: friendId}))
        )

        // const friendPosts = currentUser.following.map(friendId => {
        //     console.log('getPosts')
        //    return Post.find({userId: friendId})
        // })
        
        // currentUser.following.map(async (friendId) => {
        //     return await Post.find({userId: friendId})
        // })

        // let friendPosts = []

        // for(let userId of currentUser.following){
        //     const post = await Post.find({userId})
        //     friendPosts.push(post)
        // }
        // console.log(friendPosts)
        return res.status(200).json(userPosts.concat(...friendPosts))
    }catch(err){
        return res.status(500).json(err)
    }
})

module.exports = router