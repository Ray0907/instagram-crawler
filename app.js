const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
const PORT = 3333;
const router = express.Router();
const IGModule = require('./instagram.js');
http.createServer(app).listen(PORT, () => {
    console.log('Listening on %s', PORT);
});

app.get('/crawler/user/info', IGModule.UserInfo)
app.get('/', function(req,res){
    res.send('Connection successful !!!')
})