const postModel = require('../models/post');
const userModel = require('../models/user');
const tokenVerifier = require('../controllers/tokenVerifier');


exports.likePost = (req,res) =>{
    if(Object.keys(req.body).length==0){
        sendFailedResponse(req,res,"Request is empty")
    }else if(req.body.user_id==""|| !req.body.user_id){
        sendFailedResponse(req,res,"user id is empty");
    }else if(req.body.token=="" || !req.body.token){
        sendFailedResponse(req,res,"Token is empty");
    }else if(req.body.post_id=="" || !req.body.post_id){
        sendFailedResponse(req,res,"post id is empty");
    }

    tokenVerifier.validateToken(req.body.user_id,req.body.token).then(data=>{
        if(!userExists(req,res)){
            likeOrDisLikePost(req,res);
        }else{
            sendFailedResponse(req,res,"User doesn't exist");
        }
    }).catch(err=>{
        sendFailedResponse(req,res,err);
    })


}

function sendFailedResponse(req,res,message){
    return res.status(200).send({
        success:false,
        message:message
    })
}

function userExists(req,res){
    userModel.findOne({user_id:req.body.user_id}).then(data=>{
        console.log(Object.keys(data).length);
        if(Object.keys(data).length==0){
            console.log('at false');
            return false;
        }else{
            console.log('at true');
            return true;
        }
    }).catch(err=>{
        sendFailedResponse(req,res,err.message);
    })
}

function likeOrDisLikePost(req,res){
    postModel.find({
        $and:[
            {post_id:req.body.post_id},
            {likes:{$in:[req.body.user_id]}}
        ]
    }).then(data=>{
        if(Object.keys(data).length==0){
            likeThePost(req,res);
        }else{
            disLikePost(req,res);
        }

    }).catch(err=>{
        sendFailedResponse(req,res,err.message);
    })
}

function likeThePost(req,res){
    postModel.updateOne({
        post_id:req.body.post_id,
    },{
        $push:{likes:req.body.user_id}
    }).then(data=>{
        updateTheLikesCount(req,res,"Liked");
    }).catch(err=>{
        sendFailedResponse(req,res,err.message);
    })
}

function disLikePost(req,res){
    postModel.updateOne({
        post_id:req.body.post_id
    },{
        $pull:{likes:{$in:[req.body.user_id]}}
    }).then(data=>{
        updateTheLikesCount(req,res,"Like removed");
    }).catch(err=>{
        sendFailedResponse(req,res,err.message);
    })
}

function updateTheLikesCount(req,res,message){
    postModel.findOne({post_id:req.body.post_id}).then(data=>{
        postModel.updateOne({post_id:req.body.post_id},{
            $set:{likes_count:data.likes.length}
        }).then(data=>{
            postModel.findOne({post_id:req.body.post_id},{likes_count:1}).then(data=>{
                var dataToProcess=  data.toObject();
                dataToProcess.message = message;
                return res.status(200).send({
                    success:true,
                    data:dataToProcess
                })
            }).catch(err=>{
                sendFailedResponse(req,res,err.message);
            })
        }).catch(err=>{
            sendFailedResponse(req,res,err.message);
        })
    }).catch(err=>{
        sendFailedResponse(req,res,err.message);
    })
}