const bcrypt = require('bcrypt');
const randomString = require('randomstring');
const dbConnect = require('../configs/db_connect');


exports.register = (req, res) => {

    if (Object.keys(req.body).length == 0) {
        sendFailedResponse(req, res, "Request is empty");
    } else if (req.body.name == "" || !req.body.name) {
        sendFailedResponse(req, res, "Name is empty")
    } else if (req.body.email == "" || !req.body.email) {
        sendFailedResponse(req, res, "Email is empty");
    } else if (req.body.password == "" || !req.body.password) {
        sendFailedResponse(req, res, "Password is empty");
    }

    var dbRef = dbConnect.db.collection('users');

    dbRef.where("email", "==", req.body.email).get()
        .then(snapShot => {
            if (snapShot.empty) {
                register(req, res, dbRef);
            } else {
                sendFailedResponse(req, res, "E-mail id is already existed with another user account.")
            }
        }).catch(err => {
            sendFailedResponse(req, res, err.message);
        })
}

function sendFailedResponse(req, res, message) {
    return res.status(200).send({
        success: false,
        message: message
    })
}

function register(req, res, db) {
    var user_id = randomString.generate(7);
    var dbRef = db.doc(user_id);


    bcrypt.hash(req.body.password, 10, function(err, hash) {
        var setData = dbRef.set({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            fcm_token: req.body.fcm_token,
            web_token: req.body.web_token,
            user_id: user_id,
            no_of_posts: 0,
            profile_pic: req.body.profile_pic,
            verified: 0
        }).then(data => {
            console.log(data);
            res.status(200).send({
                success: true,
                message: 'Successfully registered',
                user_id: user_id
            })
        }).catch(err => {
            sendFailedResponse(req, res, err.message);
        })
    })
}