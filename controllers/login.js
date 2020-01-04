const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const configs = require('../configs/config');
const dbConnection = require('../configs/db_connect');


exports.login = (req, res) => {
    if (Object.keys(req.body).length == 0) {
        sendFailedResponse(req, res, "Request is empty");
    } else if (req.body.email == "" || !req.body.email) {
        sendFailedResponse(req, res, "Email is empty");
    } else if (req.body.password == "" || !req.body.password) {
        sendFailedResponse(req, res, "Password is empty");
    }

    dbConnection.db.collection('users').where('email', '==', req.body.email).get().then(data => {
        data.forEach(doc => {
            var userData = doc.data();
            checkPassword(req, res, userData);
        })
    }).catch(err => {
        sendFailedResponse(req, res, "Account not found");
    })

}


function sendFailedResponse(req, res, message) {
    return res.status(200).send({
        success: false,
        message: message
    })
}

function checkPassword(req, res, data) {
    bcrypt.compare(req.body.password, data.password, function(err, compareResponse) {
        if (err) {
            sendFailedResponse(req, res, err.message);
        } else if (!compareResponse) {
            sendFailedResponse(req, res, "Invalid password");
        } else if (compareResponse) {
            generateToken(req, res, data);
        }
    })
}

function generateToken(req, res, data) {
    var dataToProcess = data;
    const payload = {
        user_id: data.user_id
    }
    const secretKey = configs.secretkey;



    var token = jsonWebToken.sign(payload, secretKey, {
        expiresIn: '365d'
    })


    delete dataToProcess.password;
    delete dataToProcess.fcm_token;
    delete dataToProcess.web_token;
    delete dataToProcess.email;
    delete dataToProcess.no_of_posts;

    dataToProcess.token = token;

    if (req.body.fcm_token) {
        dbConnection.db.collection('users').doc(dataToProcess.user_id).update({ fcm_token: req.body.fcm_token })
            .then(data => {
                console.log(data);
            }).catch(err => {
                sendFailedResponse(req, res, err.message);
            })
    } else if (req.body.web_token) {
        dbConnection.db.collection('users').doc(dataToProcess.user_id).update({ web_token: req.body.web_token })
            .then(data => {
                console.log(data);
            }).catch(err => {
                sendFailedResponse(req, res, err.message);
            })
    }

    return res.status(200).send({
        success: true,
        data: dataToProcess
    })
}