const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    post_id:String,
    img_name:[String],
    description:String,
    likes_count:Number,
    post_by:String,
    likes:Array,
})

postSchema.index({description:"text"});

module.exports = mongoose.model('posts',postSchema);