const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    fcm_token:String,
    web_token:String,
    user_id:String,
    no_of_posts:Number,
    profile_pic:String
},{
    timestamps:true
})
module.exports = mongoose.model('user',userSchema);