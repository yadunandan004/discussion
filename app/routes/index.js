'use strict';
const h=require('../helpers');
const config=require('../config');
const jwt =require('jsonwebtoken');
const tnews = require('twitter-news')
module.exports= ()=>{
let routes={
		'get':{
			'/':[(req,res,next)=>{
				res.end('welcome to the server!!');
			}]

		},
		//user created topics are now available globally and not just restricted to a locale
		'post':{
			'/addUser':[(req,res,next)=>{
				let userData=req.body;
				h.findOne(userData.profile.id)
				.then((result)=>{

					if(result==null)
					{
						h.addUser(userData.profile,userData.accessToken,userData.secret)
						.then(data=>{
									let temp={
											profileId:data.profileId,
											name:data.name,
											profilePic:data.profilePic,
											location:data.location
										};
									let token=jwt.sign(temp,'discussionAppSecret',{expiresIn:60*60*24*15 });
									let udata=temp;
									udata.token=token;
							res.json(temp);
						})
						.catch(error=>{
							console.log('error',"Error creating a new user "+error);
						})
					}
					else
					{
						
						let temp={
							profileId:result.profileId,
							name:result.name,
							profilePic:result.profilePic,
							location:result.location
						};
						let token=jwt.sign(temp,'discussionAppSecret',{expiresIn:60*60*24*15 });
						let ldata=temp;
						ldata.token=token;
						res.json(ldata);
					}
				});
			}],
			//Getting a list of all the topics which are trending on twitter or google
			'/rooms':[(req,res,next)=>{
				h.getwoeid(req.body.location)
				.then(h.getPlaceTrends)
				.then(trends=>{
					h.mergeAllTopics(trends,(result)=>{
						res.json(result);
					})
					
				})	
				.catch(err=>{
					console.log(err);
				});

			}],
			'/checkUser':[(req,res,next)=>{
				jwt.verify(req.body.token,'discussionAppSecret',(err,decoded)=>{
					if(typeof decoded!="undefined")
					{
						h.findOne(decoded.profileId)
						.then((profile)=>{
							res.json(profile);
						})
					}
					else
					{
						res.end();
					}
					
				})
			}],
			'/getnews':[(req,res)=>{
				console.log('title',req.body.title);
				tnews(req.body.title)
				.then((data)=>{
					console.log(data);
					res.json(data);
				})
				.catch((error)=>{
					res.json({error:error});
				})
			}]
		},
		'NA':(req,res,next)=>{
			res.status(404).sendFile(process.cwd());
		}
	}
	return h.route(routes);
}