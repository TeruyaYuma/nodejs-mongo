const mongoose = require('mongoose')

const PostSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            maxLength: 200
        },
        img: {
            type: String
        },
        likes: {
            type: Array,
            dafault: []
        }
    },
    {timestamps: true}
)

module.exports = mongoose.model('Post', PostSchema)