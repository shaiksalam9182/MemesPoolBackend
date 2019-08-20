const notificationModel = require('../models/notification');
const tokenVerifier = require('../controllers/tokenVerifier');

exports.readNotifications = (req,res) => {
    if(Object.keys(req.body).length==0){
        sendFailedResponse(req,res,"request is empty");
    }else if(req.body.user_id=="" || !req.body.user_id){
        sendFailedResponse(req,res,"user id is empty");
    }else if(req.body.token=="" || !req.body.token){
        sendFailedResponse(req,res,"token is empty");
    }

    tokenVerifier.validateToken(req.body.user_id,req.body.token).then(data=>{
        readAllNotifications(req,res);
    }).catch(err=>{
        sendFailedResponse(req,res,err)
    })
}

function sendFailedResponse(req,res,message){
    return res.status(200).send({
        success:false,
        message:message,
    })
}

function readAllNotifications(req,res){
    notificationModel.find({$or:[{send_to:req.body.user_id},{send_to:"all"}]}).then(data=>{
        return res.status(200).send({
            success:true,
            data:data
        })
    }).catch(err=>{
        sendFailedResponse(req,res,err.message);
    })
}