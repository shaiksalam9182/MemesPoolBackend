module.exports = (app) => {
    const bodyParser = require('body-parser');

    const registerController = require('../controllers/register');
    const loginController = require('../controllers/login');
    const sendPostController = require('../controllers/sendPost');
    const uploadController = require('../controllers/imgUpload');
    const getImageController = require('../controllers/getImage');
    const likePostController = require('../controllers/likePost');
    const feedController = require('../controllers/feed');

    app.use(bodyParser.urlencoded({
        extended: true
    }))

    app.use(bodyParser.json());

    app.post('/register', registerController.register);
    app.post('/login', loginController.login);
    app.post('/sendPost', sendPostController.sendPost);
    app.post('/upload',uploadController.upload);
    app.get('/getImage/:name',getImageController.getImage);
    app.post('/like',likePostController.likePost);
    app.post('/feed',feedController.getFeed);

}
