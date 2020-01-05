const tokenVerifier = require('../controllers/tokenVerifier');
const dbConnection = require('../configs/db_connect');

exports.readNotifications = (req, res) => {
    if (Object.keys(req.body).length == 0) {
        sendFailedResponse(req, res, "request is empty");
    } else if (req.body.user_id == "" || !req.body.user_id) {
        sendFailedResponse(req, res, "user id is empty");
    } else if (req.body.token == "" || !req.body.token) {
        sendFailedResponse(req, res, "token is empty");
    }

    tokenVerifier.validateToken(req.body.user_id, req.body.token).then(data => {
        readAllNotifications(req, res);
    }).catch(err => {
        sendFailedResponse(req, res, err)
    })
}

function sendFailedResponse(req, res, message) {
    return res.status(200).send({
        success: false,
        message: message,
    })
}

function readAllNotifications(req, res) {
    var receiveddata = [];
    dbConnection.db.collection('notifications').where('send_to', "in", [req.body.user_id, "all"]).get()
        .then(data => {
            console.log(data);
            if (data) {
                data.forEach(doc => {
                    receiveddata.push(doc.data());
                })
                if (receiveddata) {
                    return res.status(200).send({
                        success: true,
                        data: receiveddata
                    })
                } else {
                    sendFailedResponse(req, res, "No notifications found")
                }
            } else {
                sendFailedResponse(req, res, "No notifications found")
            }
        })
        .catch(err => {
            sendFailedResponse(req, res, err.message);
        })
}