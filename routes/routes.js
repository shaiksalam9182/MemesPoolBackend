module.exports = (app) =>{
    const bodyParser = require('body-parser');

    app.use(bodyParser.urlencoded({
        extended:true
    }))

    app.use(bodyParser.json());

    app.get('/',function(req,res){
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end("<h1>Hello world....!</h1>")
    })
}
