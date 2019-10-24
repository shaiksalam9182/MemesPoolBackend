const userModel = require('../models/user');

exports.verifyEmail = (req,res) =>{
    var userID = req.params.uid;

    userModel.findOne({user_id:userID}).then(data=>{
        if(Object.keys(data).length>0){
            if(data.verified==1){
                return res.status(200).send({
                    success:true,
                    message:'You are already verified'
                })
            }else{
                updateUserRecord(req,res,data.user_id);
            }            
        }else{
            sendFailedResponse(req,res,"Invalid User");
        }
    }).catch(err=>{
        sendFailedResponse(req,res,err.message)
    })
}

function sendFailedResponse(req,res,message){
    return res.status(200).send({
        success:false,
        message:message
    })
}

function updateUserRecord(req,res,user_id){
    userModel.updateOne({user_id:user_id},{$set:{verified:1}}).then(data=>{
        return res.status(200).send({
            success:true,
            message:'successfully verified'
        })
    }).catch(err=>{
        sendFailedResponse(req,res,err.message);
    })
}