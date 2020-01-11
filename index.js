const express = require('express');
const bodyParser = require('body-parser');

const config = require('./configs/config');

var app = express();

require('./routes/routes')(app);


app.listen(8080,()=>{
    console.log('server running successfully at port 8080');
})
