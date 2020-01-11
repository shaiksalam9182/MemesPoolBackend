const jwt = require('jsonwebtoken');
const configs = require('../configs/config');

exports.validateToken = function(user_id, token) {
    const secretKey = configs.secretkey;

    return new Promise(function(resolve, reject) {
        jwt.verify(token, secretKey, function(err, decoded) {
            if (err) {
                return reject(err.message);
            } else {
                if (decoded.user_id == user_id) {
                    return resolve(true);
                } else {
                    return reject('Invalid token');
                }
            }
        })
    })


}