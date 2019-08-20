const postModel = require('../models/post');
const tokenVerifier = require('../controllers/tokenVerifier');

exports.search = (req,res) =>{
    if(Object.keys(req.body).length==0){
        sendFailedResponse(req,res,"request is empty");
    }else if(req.body.user_id=="" || !req.body.user_id){
        sendFailedResponse(req,res,"user id is empty");
    }else if(req.body.token=="" || !req.body.token){
        sendFailedResponse(req,res,"token is empty");
    }else if(req.body.key=="" || !req.body.key){
        sendFailedResponse(req,res,"key is empty");
    }

    tokenVerifier.validateToken(req.body.user_id,req.body.token).then(data=>{
        searchPosts(req,res);
    }).catch(err=>{
        sendFailedResponse(req,res,err);
    })
}

function sendFailedResponse(req,res,message){
    return res.status(200).send({
        success:true,
        message:message
    })
}

function searchPosts(req,res){
    postModel.find({$text:{$search:req.body.key}}).then(data=>{
        return res.status(200).send({
            success:true,
            data:data
        })
    }).catch(err=>{
        sendFailedResponse(req,res,err.message);
    })
}