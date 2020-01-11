const tokenVerifier = require('../controllers/tokenVerifier');
const dbConnection = require('../configs/db_connect');
const firestore = require('@google-cloud/firestore');


exports.likePost = (req, res) => {
    if (Object.keys(req.body).length == 0) {
        sendFailedResponse(req, res, "Request is empty")
    } else if (req.body.user_id == "" || !req.body.user_id) {
        sendFailedResponse(req, res, "user id is empty");
    } else if (req.body.token == "" || !req.body.token) {
        sendFailedResponse(req, res, "Token is empty");
    } else if (req.body.post_id == "" || !req.body.post_id) {
        sendFailedResponse(req, res, "post id is empty");
    }

    tokenVerifier.validateToken(req.body.user_id, req.body.token).then(data => {
        if (!userExists(req, res)) {
            likeOrDisLikePost(req, res);
        } else {
            sendFailedResponse(req, res, "User doesn't exist");
        }
    }).catch(err => {
        console.log(err);
        sendFailedResponse(req, res, err);
    })


}

function sendFailedResponse(req, res, message) {
    return res.status(200).send({
        success: false,
        message: message
    })
}

function userExists(req, res) {

    dbConnection.db.collection('users').where('user_id', '==', req.body.user_id).get()
        .then(data => {
            if (!data.empty) {
                console.log('user exists');
                return true
            } else {
                console.log('user does not exists');
                return false
            }

        }).catch(err => {
            console.log(err);
            sendFailedResponse(req, res, err.message)
        })
}

function likeOrDisLikePost(req, res) {
    dbConnection.db.collection('posts').doc(req.body.post_id).get()
        .then(snapShot => {
            if (snapShot.data().likes.indexOf(req.body.user_id) >= 0) {
                disLikePost(req, res);
            } else {
                likeThePost(req, res);
            }
        }).catch(err => {
            console.log(err);
            sendFailedResponse(req, res, err);
        })
}

function likeThePost(req, res) {
    var dbRef = dbConnection.db.collection('posts').doc(req.body.post_id);
    dbRef.update({ likes: firestore.FieldValue.arrayUnion(req.body.user_id) })
        .then(data => {
            updateTheLikesCount(req, res, "Liked")
        })
        .catch(err => {
            sendFailedResponse(req, res, err.message);
        })
}

function disLikePost(req, res) {
    var dbRef = dbConnection.db.collection('posts').doc(req.body.post_id);
    dbRef.update({ likes: firestore.FieldValue.arrayRemove(req.body.user_id) })
        .then(data => {
            updateTheLikesCount(req, res, "Like removed");
        })
        .catch(err => {
            sendFailedResponse(req, res, err);
        })
}

function updateTheLikesCount(req, res, message) {
    // postModel.findOne({ post_id: req.body.post_id }).then(data => {
    //     postModel.updateOne({ post_id: req.body.post_id }, {
    //         $set: { likes_count: data.likes.length }
    //     }).then(data => {
    //         postModel.findOne({ post_id: req.body.post_id }, { likes_count: 1 }).then(data => {
    //             var dataToProcess = data.toObject();
    //             dataToProcess.message = message;
    //             return res.status(200).send({
    //                 success: true,
    //                 data: dataToProcess
    //             })
    //         }).catch(err => {
    //             sendFailedResponse(req, res, err.message);
    //         })
    //     }).catch(err => {
    //         sendFailedResponse(req, res, err.message);
    //     })
    // }).catch(err => {
    //     sendFailedResponse(req, res, err.message);
    // })

    var dbRef = dbConnection.db.collection('posts').doc(req.body.post_id).get()
        .then(data => {
            var likesCount = data.data().likes.length;
            dbConnection.db.collection('posts').doc(req.body.post_id).update({ likes_count: likesCount })
                .then(data => {
                    dbConnection.db.collection('posts').doc(req.body.post_id).get()
                        .then(data => {
                            return res.status(200).send({
                                success: true,
                                message: message,
                                likes_count: data.data().likes_count
                            })
                        }).catch(err => {
                            sendFailedResponse(req, res, err)
                        })
                }).catch(err => {
                    sendFailedResponse(req, res, err)
                })

        }).catch(err => {
            sendFailedResponse(req, res, err)
        })

}