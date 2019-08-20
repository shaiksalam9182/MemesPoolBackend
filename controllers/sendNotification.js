const notificationsModel = require('../models/notification');
const tokenVerifier = require('../controllers/tokenVerifier');

const randomString = require('randomstring');


exports.sendNotification = (req,res) =>{
    if(Object.keys(req.body).length==0){
        sendFailedResponse(req,res,"Request is empty")
    }else if(req.body.user_id=="" || !req.body.user_id){
        sendFailedResponse(req,res,"user id empty");
    }else if(req.body.token=="" || !req.body.token){
        sendFailedResponse(req,res,"token is empty");
    }else if(req.body.title =="" || !req.body.title){
        sendFailedResponse(req,res,"title is empty");
    }else if(req.body.description==""|| !req.body.description){
        sendFailedResponse(req,res,"description is empty");
    }else if(req.body.send_to=="" || !req.body.send_to){
        sendFailedResponse(req,res,"send to is empty")
    }

    tokenVerifier.validateToken(req.body.user_id,req.body.token).then(data=>{
        saveTheNotification(req,res);
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


function saveTheNotification(req,res){
    var not_id = randomString.generate(10);

    const notData = new notificationsModel({
        notification_id: not_id,
        title:req.body.title,
        description:req.body.description,
        image:req.body.image,
        send_to:req.body.send_to,
        sent_by:req.body.sent_by
    })

    notData.save().then(data=>{
        return res.status(200).send({
            success:true,
            data:data
        })
    }).catch(err=>{
        sendFailedResponse(req,res,err.message);
    })
}