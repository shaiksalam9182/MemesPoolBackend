module.exports = (app) => {
    const bodyParser = require('body-parser');
    const cors = require('cors');

    const registerController = require('../controllers/register');
    const loginController = require('../controllers/login');
    const sendPostController = require('../controllers/sendPost');
    const uploadController = require('../controllers/imgUpload');
    const getImageController = require('../controllers/getImage');
    const likePostController = require('../controllers/likePost');
    const feedController = require('../controllers/feed');
    const saveNotificationController = require('../controllers/sendNotification');
    const readNotificationsController = require('../controllers/readNotifications');
    const accountDetailsController = require('../controllers/accountDetails');
    const searchController = require('../controllers/search');
    const verifyEmail = require('../controllers/verifyEmail');
    const Multer = require('multer');

    const multer = Multer({
        storage: Multer.MemoryStorage,
        limits: {
            fileSize: 2 * 1024 * 1024,
        },
    });


    app.use(bodyParser.urlencoded({
        extended: true
    }))

    app.use(bodyParser.json());
    app.use(cors());


    app.post('/register', registerController.register);
    app.post('/login', loginController.login);
    app.post('/sendPost', sendPostController.sendPost);
    app.post('/upload', multer.single('image'), uploadController.upload);
    app.get('/getImage/:name', getImageController.getImage);
    app.post('/like', likePostController.likePost);
    app.post('/feed', feedController.getFeed);
    app.post('/send_not', saveNotificationController.sendNotification);
    app.post('/read_not', readNotificationsController.readNotifications);
    app.post('/account', accountDetailsController.accountDetails);
    app.post('/search', searchController.search);
    app.get('/verify/:uid', verifyEmail.verifyEmail);

}