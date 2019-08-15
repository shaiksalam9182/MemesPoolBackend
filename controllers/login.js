const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const userModel = require('../models/user');
const configs = require('../configs/config');


exports.login = (req,res) =>{
    if(Object.keys(req.body).length==0){
        sendFailedResponse(req,res,"Request is empty");
    }else if(req.body.email=="" || !req.body.email){
        sendFailedResponse(req,res,"Email is empty");
    }else if(req.body.password=="" || !req.body.password){
        sendFailedResponse(req,res,"Password is empty");
    }


    userModel.findOne({email:req.body.email}).then(data=>{
        if(Object.keys(data).length>0){
            checkPassword(req,res,data);
        }else{
            sendFailedResponse(req,res,"User not found");
        }
    }).catch(err=>{
        sendFailedResponse(req,res,"Account not found");
    })


}


function sendFailedResponse(req,res,message){
    return res.status(200).send({
        success:false,
        message:message
    })
}

function checkPassword(req,res,data){
    bcrypt.compare(req.body.password,data.password,function(err,compareResponse){
        if(err){
            sendFailedResponse(req,res,err.message);
        }else if(!compareResponse){
            sendFailedResponse(req,res,"Invalid password");
        }else if(compareResponse){
            generateToken(req,res,data);
        }
    })
}

function generateToken(req,res,data){
    var dataToProcess = data.toObject();
    const payload = {
        user_id:data.user_id
    }

    var token = jsonWebToken.sign(payload,configs.secretKey,{
        expiresIn:'365d'
    })

    delete dataToProcess.password;
    delete dataToProcess.__v;
    delete dataToProcess.fcm_token;
    delete dataToProcess.web_token;
    delete dataToProcess.email;
    delete dataToProcess.no_of_posts;
    delete dataToProcess._id;

    dataToProcess.token = token;

    if(req.fcm_token){
        userModel.updateOne({email:req.body.email},{
            $set:{fcm_token:req.body.fcm_token}
        }).then(data=>{
            console.log('successfully updated fcm token',data);
        }).catch(err=>{
            sendFailedResponse(req,res,err.message);
        })
    }else if(req.web_token){
        userModel.updateOne({email:req.body.email},{
            $set:{web_token:req.body.web_token}
        }).then(data=>{
            console.log('successfully updated web token',data);
        }).catch(err=>{
            sendFailedResponse(req,res,err.message);
        })
    }else{
        return res.status(200).send({
            success:true,
            data:dataToProcess
        })
    }
}