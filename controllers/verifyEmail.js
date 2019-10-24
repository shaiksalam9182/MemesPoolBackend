const userModel = require('../models/user');
var path = require('path');

exports.verifyEmail = (req,res) =>{
    var userID = req.params.uid;

    userModel.findOne({user_id:userID}).then(data=>{
        if(Object.keys(data).length>0){
            if(data.verified==1){
                return res.sendFile(path.join(__dirname, '../html', 'already.html'));
            }else{
                updateUserRecord(req,res,data.user_id);
            }            
        }else{
            return res.sendFile(path.join(__dirname, '../html', 'invalid.html'));
        }
    }).catch(err=>{
        return res.sendFile(path.join(__dirname, '../html', 'error.html'));
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
        return res.sendFile(path.join(__dirname, '../html', 'verified.html'));
    }).catch(err=>{
        sendFailedResponse(req,res,err.message);
    })
}