const postModel = require('../models/post');
const tokenVerifier = require('../controllers/tokenVerifier');


exports.getFeed = (req,res)=>{
    if(Object.keys(req.body).length==0){
        sendFailedResponse(req,res,"Request is empty");
    }else if(req.body.user_id=="" || !req.body.user_id){
        sendFailedResponse(req,res,"User id is empty")
    }else if(req.body.token=="" || !req.body.token){
        sendFailedResponse(req,res,"Token is empty");
    }else if(req.body.skip==undefined ){
        console.log(req.body.skip);
        sendFailedResponse(req,res,"Skip value is empty");
    }


    tokenVerifier.validateToken(req.body.user_id,req.body.token).then(data=>{
        getTheFeed(req,res);
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

function getTheFeed(req,res){
    postModel.find({},{
        _id:0,
        __v:0
    }).limit(10).skip(req.body.skip)
    .then(data=>{
        return res.status(200).send({
            success:true,
            data:data
        })
    }).catch(err=>{
        sendFailedResponse(err.message);
    })
}