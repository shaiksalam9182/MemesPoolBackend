const dbConnection = require('../configs/db_connect');
const tokenVerifier = require('../controllers/tokenVerifier');

exports.accountDetails = (req, res) => {
    if (Object.keys(req.body).length == 0) {
        sendFailedResponse(req, res, "request is empty");
    } else if (req.body.user_id == "" || !req.body.user_id) {
        sendFailedResponse(req, res, "user id is empty");
    } else if (req.body.token == "" || !req.body.token) {
        sendFailedResponse(req, res, "toke is empty");
    } else if (req.body.v_id == "" || !req.body.v_id) {
        sendFailedResponse(req, res, "v_id is empty");
    }

    tokenVerifier.validateToken(req.body.user_id, req.body.token).then(data => {
        if (req.body.user_id == req.body.v_id) {
            getAccountDetails(req, res);
        } else {
            sendFailedResponse(req, res, "You are not permitted to do this action")
        }
    }).catch(err => {
        sendFailedResponse(req, res, err);
    })
}

function sendFailedResponse(req, res, message) {
    return res.status(200).send({
        success: false,
        message: message
    })
}

function getAccountDetails(req, res) {
    dbConnection.db.collection('users').where('user_id', '==', req.body.user_id).get().then(data => {
        if (data) {
            data.forEach(doc => {
                var userdata = doc.data();
                delete userdata.password;
                if (doc) {
                    return res.status(200).send({
                        success: true,
                        data: userdata
                    })
                }
            })
        } else {
            sendFailedResponse(req, res, "No details found");
        }


    }).catch(err => {
        sendFailedResponse(req, res, err);
    })
}