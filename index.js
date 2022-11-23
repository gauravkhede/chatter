const express=require('express');
const app=express();
require('./config/view-helper')(app);
const port=8000;
const cors=require('cors');
// var bodyParser = require('body-parser');
// var jsonParser = bodyParser.json();
const db=require('./config/mongoose');
const env=require('./config/environment');
const logger=require('morgan');
const cookieParser = require('cookie-parser');
app.use(express.urlencoded());
app.use(cookieParser());
app.use('/',require('./routes'));
app.set('view engine','ejs');
app.set('views','./views');
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(logger(env.morgan.mode,env.morgan.options));
app.use(cors());
app.use(express.static("assets"));



const chatServer= require('http').Server(app);
const chatSockets= require('./config/chat_sockets').chatSockets(chatServer);

chatServer.listen(5000);
console.log(`chat server is listening on port 5000`);

app.listen(process.env.PORT || port,function(){
    console.log("App is running succesfully on port number",port);
});