const userModel = require('../models/user');

const bcrypt = require('bcrypt');
const randomString = require('randomstring');

exports.register = (req,res) =>{
    if(Object.keys(req.body).length==0){
        sendFailedResponse(req,res,"Request is empty");
    }else if(req.body.name=="" || !req.body.name){
        sendFailedResponse(req,res,"Name is empty")
    }else if(req.body.email=="" || !req.body.email){
        sendFailedResponse(req,res,"Email is empty");
    }else if(req.body.password=="" || !req.body.password){
        sendFailedResponse(req,res,"Password is empty");
    }

    userModel.find({email:req.body.email}).then(data=>{
        if(Object.keys(data).length>0){
            sendFailedResponse(req,res,"user already registered");
        }else{
            register(req,res);
        }
    })
}

function sendFailedResponse(req,res,message){
    return res.status(200).send({
        success:false,
        message:message
    })
}

function register(req,res){
    var user_id = randomString.generate(7);

    bcrypt.hash(req.body.password,10,function(err,hash){
        const register = new userModel({
            name:req.body.name,
            email:req.body.email,
            password:hash,
            fcm_token : req.body.fcm_token,
            web_token : req.body.web_token,
            user_id:user_id,
            no_of_posts:0
        })

        register.save().then(data=>{
            res.status(200).send({
                success:true,
                message:'Successfully registered'
            })
        }).catch(err=>{
            sendFailedResponse(req,res,err.message);
        })
    })
}