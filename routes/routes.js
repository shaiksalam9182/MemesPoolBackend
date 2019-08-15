module.exports = (app) =>{
    const bodyParser = require('body-parser');

    const registerController = require('../controllers/register');
    const loginController = require('../controllers/login');

    app.use(bodyParser.urlencoded({
        extended:true
    }))

    app.use(bodyParser.json());

    app.get('/',function(req,res){
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end("<h1>Hello world....!</h1>")
    })

    app.post('/register',registerController.register);
    app.post('/login',loginController.login);
}
