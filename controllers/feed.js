const tokenVerifier = require('../controllers/tokenVerifier');
const dbConnection = require('../configs/db_connect');


exports.getFeed = (req, res) => {
    if (Object.keys(req.body).length == 0) {
        sendFailedResponse(req, res, "Request is empty");
    } else if (req.body.user_id == "" || !req.body.user_id) {
        sendFailedResponse(req, res, "User id is empty")
    } else if (req.body.token == "" || !req.body.token) {
        sendFailedResponse(req, res, "Token is empty");
    } else if (req.body.skip == undefined) {
        console.log(req.body.skip);
        sendFailedResponse(req, res, "Skip value is empty");
    }


    tokenVerifier.validateToken(req.body.user_id, req.body.token).then(data => {
        getTheFeed(req, res);
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

function getTheFeed(req, res) {
    var receivedData = [];
    dbConnection.db.collection('posts').orderBy('post_id').startAt(req.body.skip).limit(10).get()
        .then(data => {
            if (data) {
                data.forEach(doc => {
                    delete doc.data().likes;
                    receivedData.push(doc.data());
                })
                return res.status(200).send({
                    success: true,
                    data: receivedData
                })
            } else {
                sendFailedResponse(req, res, "No data found");
            }
        })
        .catch(err => {
            console.log(err);
            sendFailedResponse(req, res, err);
        })
}