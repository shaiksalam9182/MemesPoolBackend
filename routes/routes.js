module.exports = (app) => {
    const bodyParser = require('body-parser');
    const multer = require('multer');
    const fs = require('fs');
    const randomString = require('randomstring');
    const path = require('path');

    const registerController = require('../controllers/register');
    const loginController = require('../controllers/login');
    const sendPostController = require('../controllers/sendPost');
    const uploadController = require('../controllers/imgUpload');

    app.use(bodyParser.urlencoded({
        extended: true
    }))

    app.use(bodyParser.json());

    app.post('/register', registerController.register);
    app.post('/login', loginController.login);
    app.post('/sendPost', sendPostController.sendPost);
    app.post('/upload',uploadController.upload);
}
