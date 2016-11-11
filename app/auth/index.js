'use strict';
const passport=require('passport');
const config=require('../config');
const FacebookStrategy= require('passport-facebook').Strategy;
const TwitterStrategy=require('passport-twitter').Strategy;
const h=require('../helpers');
const logger = require('../logger');
module.exports=()=>{
	passport.serializeUser((user,done)=>{
		done(null,user.id);
	});
	passport.deserializeUser((id,done)=>{
		h.findById(id)
		.then((user)=>done(null,user))
		.catch(error=>logger.log('error','Error when deserializing user'+error));
	});
	let authProcessor=(accessToken,refreshToken,profile,done)=>{
		//find a user in local db using prodile.id
		//if user is found, return the user data using done()
		//else, create one in the local db and return
		//console.log('result is '+profile);
		h.findOne(profile.id)
		.then(result=>{
			
			if(result!=null)
			{
				//console.log('user present');
				done(null,result);
			}else
			{
				h.addUser(profile)
				.then(result=>{
					
					done(null,result);
				})
				.catch(error=>{
					logger.log('error',"Error creating a new user "+error);
				})
			}
		})
	}
	passport.use(new FacebookStrategy(config.fb,authProcessor));
	passport.use(new TwitterStrategy(config.twitter,authProcessor));
}