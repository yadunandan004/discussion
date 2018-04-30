'use strict';
const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const chatCat=require('./app');
const request=require('request');
const h=require('./app/helpers');
const config=require('./app/config');
const port=process.env.PORT || 8080;
app.set('port',port);
app.use(express.static('client/build'));
app.use(bodyParser.json({
	type:'application/json'
}));
app.use(chatCat.session);
app.use('/',chatCat.router);

chatCat.ioServer(app).listen(app.get('port'),()=>{
	console.log('Chatcat running on port: '+port);
})