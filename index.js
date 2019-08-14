const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./configs/config');

var app = express();

require('./routes/routes')(app);

mongoose.Promise = global.Promise;

mongoose.connect(config.url,{
    useNewUrlParser:true
}).then(()=>{
    console.log('successfully connected to the database');
}).catch(err=>{
    console.log('Error in connecting to database',err);
})


app.listen(8080,()=>{
    console.log('server running successfully at port 8080');
})
