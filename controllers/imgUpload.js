const multer = require('multer');
const fs = require('fs');
const randomString = require('randomstring');
const path = require('path');


var storage = multer.diskStorage({
    destination:"/uploads",
    filename: function (req, file, cb) {
        var generatedName = randomString.generate(16) + path.extname(file.originalname);
        console.log(generatedName);
        cb(null, generatedName)
    }
})

var uploads = multer({
    storage: storage, fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext != ".jpg" && ext != ".jpeg" && ext != ".png") {
            return new callback(new Error('Only Images are allowed'))
        }
        callback(null, true);
    }
}).array('uploads',15);

exports.upload = (req,res)=>{

    uploads(req,res,function(err){
        if(err instanceof multer.MulterError){
            console.log(err);
            res.status(200).send({
                success:false,
                message:"This file cannot be uploaded"
            })
        }else if(err){
            console.log(err);
            res.status(200).send({
                success:false,
                message:"This file cannot be uploaded"
            })
        }else{
            res.status(200).send({
                success:true,
                image: req.files
            })
        }
    })

}