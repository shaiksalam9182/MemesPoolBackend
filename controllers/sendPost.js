const postModel = require('../models/post');
const tokenVerifier = require('../controllers/tokenVerifier');

const randomString = require('randomstring');

exports.sendPost = (req,res) =>{
    if(Object.keys(req.body).length==0){
        sendFailedResponse(req,res,"Request is empty");
    }else if(req.body.user_id=="" || !req.body.user_id){
        sendFailedResponse(req,res,"User id is empty");
    }else if(req.body.token=="" || !req.body.token){
        sendFailedResponse(req,res,"token is empty");
    }else if(req.body.description=="" || !req.body.description){
        sendFailedResponse(req,res,"description is empty");
    }else if(req.body.image=="" || !req.body.image){
        sendFailedResponse(req,res,"Image is empty");
    }

    tokenVerifier.validateToken(req.body.user_id,req.body.token).then(data=>{
        savePost(req,res);
    }).catch(err=>{
        console.log(err);
        sendFailedResponse(req,res,err);
    })
}

function sendFailedResponse(req,res,message){
    return res.status(200).send({
        success:false,
        message:message
    })
}

function savePost(req,res){
    const post = new postModel({
        post_id:randomString.generate(10),
        img_name:req.body.image,
        description:req.body.description,
        likes_count:0,
        post_by:req.body.user_id,
    })

    post.save().then(data=>{
        return res.status(200).send({
            success:true,
            message:'successfully posted'
        })
    }).catch(err=>{
        sendFailedResponse(req,res,err.message);
    })
}