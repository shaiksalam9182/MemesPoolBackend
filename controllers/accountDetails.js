const userModel = require('../models/user');
const tokenVerifier = require('../controllers/tokenVerifier');

exports.accountDetails = (req,res) =>{
    if(Object.keys(req.body).length==0){
        sendFailedResponse(req,res,"request is empty");
    }else if(req.body.user_id=="" || !req.body.user_id){
        sendFailedResponse(req,res,"user id is empty");
    }else if(req.body.token=="" || !req.body.token){
        sendFailedResponse(req,res,"toke is empty");
    }else if(req.body.v_id=="" || !req.body.v_id){
        sendFailedResponse(req,res,"v_id is empty");
    }

    tokenVerifier.validateToken(req.body.user_id,req.body.token).then(data=>{
        if(req.body.user_id==req.body.v_id){
            getAccountDetails(req,res);
        }else{
            sendFailedResponse(req,res,"You are not permitted to do this action")
        }
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

function getAccountDetails(req,res){
    userModel.findOne({user_id:req.body.user_id},{password:0}).then(data=>{
        return res.status(200).send({
            success:true,
            data:data
        })
    }).catch(err=>{
        sendFailedResponse(req,res,err.message);
    })
}