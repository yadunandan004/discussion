'use strict';
const config=require('../config');
const Mongoose=require('mongoose').connect(config.dbURI);
const logger= require('../logger');
Mongoose.connection.on('error',error=>{
	logger.log('error',"MongoDB Error: "+error);
});
//
const chatUser= new Mongoose.Schema({
	profileId:String,
	name: String,
	profilePic:String,
	location:String,
	accessToken:String,
	secret:String
});
const chatTopic=new Mongoose.Schema({
	name:String,
	source:String,
	creatorId:String,
	users:[{}],
	messages:[{}]
});
const trendsPlace=new Mongoose.Schema({
	data:{type:Array,default:[]}
})
let userModel= Mongoose.model('chatUser',chatUser);
let trendsModel=Mongoose.model('trendsPlace',trendsPlace);
let topicsModel=Mongoose.model('topics',chatTopic);
module.exports={
	Mongoose,
	userModel,
	trendsModel,
	topicsModel
}