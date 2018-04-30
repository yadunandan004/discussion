'use strict';
const router=require('express').Router();
const db=require('../db');
const crypto=require('crypto');
const config=require('../config');
const request=require('request');

const gmap=require('@google/maps').createClient({
	key:'AIzaSyA10cqS6QAIe6khf31ZtkPawYNK52VRGwI'
});
let _registerRoutes=(routes,method)=>{
	for(let key in routes){
		if(typeof routes[key]==='object' && routes[key] !== null && !(routes[key] instanceof Array)){
			_registerRoutes(routes[key],key);
		} else {
			//Register the routes
			if(method ==='get')
			{
				router.get(key,routes[key]);
			} else if (method === 'post'){
				router.post(key,routes[key]);
			}else{
				router.use(routes[key]);
			}
		}
	}
}
//find a user based on a key
let findOne=(profileID)=>{
	//console.log('searching for profileid');
	return db.userModel.findOne({
		'profileId':profileID
	})
}
//find a user by _id
let findById=(id)=>{
	return new Promise((resolve,reject)=>{
		db.userModel.findById(id,(error,user)=>{
			if(error)
			{
				reject(error);
			}
			else
			{
				resolve(user);
			}
		});
	});
}

//add a new user 
let addUser=(profile,accessToken,secret)=>{
	return new Promise((resolve,reject)=>{
		let newChatUser= new db.userModel({
			profileId:profile.id_str,
			name:profile.name,
			profilePic:profile.profile_image_url,
			location:profile.location,
			accessToken:accessToken,
			secret:secret
		});

		newChatUser.save(error=>{
			if(error)
			{
				reject(error);
			}else{
				
				resolve(newChatUser);
			}
		});
	});
}
let route= routes=>{
	_registerRoutes(routes);
	return router;
}
let addNewTopic=(details)=>{
		let tempList=[];
		return findTopic(details.topic.name)
		.then((result)=>{
			if(result==null)
			{
				tempList.push({
				profileId:details.user.profileId,
				name: details.user.name,
				profilePic:details.user.profilePic,
				location:details.user.location
				})
				let newTopic= new db.topicsModel({
					name:details.topic.name,
					source:details.topic.source,
					creatorId:details.topic.creatorId,
					users:tempList,
					messages:[]
				});

				return newTopic.save((err,topic)=>{
					return new Promise((resolve,reject)=>{
						if(err)
						{
							reject(err);
						}
						else
						{
							
							resolve(topic);
						}
					})
				})
			}
			else
			{
				return new Promise((resolve,reject)=>{
					if(result)
					{
						resolve(result);
					}
					else
					{
						reject('sometinh wong');
					}
					
				})
			}
		})
		
}
let findTopic=(room)=>{
	 return db.topicsModel.findOne({'name':room},(err,doc)=>{
	 	return new Promise((resolve,reject)=>{
	 		if(err)
	 		{
	 			reject(err);
	 		}
	 		else
	 		{
	 			// console.log(doc);
	 			resolve(doc);
	 		}
	 	})
	 })
}


//function to generate a unique room ID

let randomHex = ()=>{
	return crypto.randomBytes(24).toString('hex');
}
let setTrends=(list,done)=>{
	getTrends()
	.then(data=>{
		if(data==null)
		{
			var trendslist=new db.trendsModel({
				data:list
			});
			trendslist.save(error=>{
				if(error){
					done(0);
					console.log(error);
				}
				else
				{
					done(1);
				}
			});
		}
		else
		{	
			done(1);
			console.log('trends already listed in db');
		}
	})
	.catch(err=>{
		logger.log('error','error fetching data from db '+err);
	})
	
};
let addMsgToTopic=(data)=>{
	return findTopic(data.topic)
	.then((result)=>{
		let tm=result.messages;
		tm.push({msg:data.msg,user:data.user});
		result.messages=tm;
		return result.save()
	})
}
let getTrends=()=>{
	return new Promise((resolve,reject)=>{
		db.trendsModel.findOne({},(err,data)=>{
			if(err)
			{
				reject(err);
			}
			else
			{
				resolve(data);
			}
		});
	});
}

//Add user to a chatroom
let addUserToTopic=(data,socket)=>{
	return findTopic(data.topic.name)
	.then((getTopic)=>{
			if(getTopic !== undefined){

		//get users active ID (objectID as used in session)
			let userID= data.user.profileId;
			
			//check to see if the user exists
			let checkUser=getTopic.users.findIndex((element,index,array)=>{
				if(element.profileId === userID)
				{
					return true;
				}
				else
				{
					return false;
				}
			});
			//if the user if already present in the room, then remove him first
			if(checkUser > -1){
				getTopic.users.splice(checkUser,1);
			}
			let temp={
				profileId:data.user.profileId,
				name: data.user.name,
				profilePic:data.user.profilePic,
				location:data.user.location,
				socket:socket.id
			};
			getTopic.users.push(temp);
			 return getTopic.save((err,topic)=>{
				return new Promise((resolve,reject)=>{
					if(err)
					{
						console.log(err);
						reject(err);
					}
					else
					{
						
						resolve(topic);
					}

				})
				})
			}
			else
			{
				console.log('topic is undefined');
			}
		})
	
}
let findAllTopics=(socket,done)=>{
	db.topicsModel.find({})
	.then(topics=>{
		for(let i=0; i<topics.length;i++)
		{
			let found=false;
			let j=0;
			while((j<topics[i].users.length)&&(!found))
			{
				if(topics[i].users[j].socket==socket.id)
				{
					found=true;
				}
				j++;
			}
			if(found)
			{
				done(topics[i]);
			}

		}
	})

}
let mergeAllTopics=(trends,done)=>{
	db.topicsModel.find({'source':'user'})
	.then((result)=>{
		done({user:result,twitter:trends});
	})
}
let removeUserFromTopic=(socket,done)=>{
		return findAllTopics(socket,(topic)=>{

				let findUser= topic.users.findIndex((element,index,array)=>{
				if(element.socket === socket.id)
				{
					return true;
				}
				else{
					return false;
				}
				});
				if(findUser > -1)
				{
					socket.leave(topic.name);
					topic.users.splice(findUser,1);
					if(typeof topic.users==="undefined")
					{
						topic.users=[];
					}
					if(topic.users.length==0)
					{
						topic.remove();
						
					}
					else
					{
						 topic.save()
						 .then(doc=>done(doc));
					}	
					
				}
		})
		
}

let getwoeid=(location,done)=>{
	return new Promise((resolve,reject)=>{
		gmap.geocode({
		  address:JSON.stringify(location)
		}, function(err, response) {
		  if (!err) {
		    var address=response.json.results[0].address_components;
		    let i=address.length-1;
		   	while((address[i].types.includes("country")==false)&&(i>=0))
		   	{
		   		i--;
		   	}		   	
		   	var country=address[i].long_name;
		   	var state=address[i-1].long_name;
		   	getTrends()
		   	.then(data=>{
		   			let list=JSON.parse(data.data);
		   			let temp_res=[];
		   			var re1=new RegExp(country,"i");
		   			var re2=new RegExp(state,"i");
		   			for(let j=0;j<list.length;j++)
		   			{
		   				// console.log(re1.test(list[j].country));
		   				if(re1.test(list[j].country))
		   				{
		   					temp_res.push(list[j]);
		   				}
		   			}
		   			if(temp_res.length>1)
		   			{
		   				for(let k=0;k<temp_res.length;k++)
		   				{
		   					if(re2.test(temp_res[k].name))
			   				{
			   					resolve(temp_res[k].woeid);
			   				}
		   				}
		   			}
		   			else
		   			{
		   				if(temp_res.length==1)
		   				{
		   					resolve(temp_res[0].woeid);
		   				}
		   				else
		   				{
		   					reject(0);
		   				}
		   			}
		   	})
		   	.catch(error=>{
		   		console.log(err);
		   		reject(err);
		   		logger.log('error','error fetching list from db '+err);
		   	});
		  }
		  else
		  {
		  	reject(err);
		  }
		});
	});
	
}
let getPlaceTrends=woeid=>{
	return new Promise((resolve,reject)=>{
		var header={
			'User-Agent':'request',
			Authorization:'Bearer '+config.twitter.bearer_token
		};
		var options={
			url:'https://api.twitter.com/1.1/trends/place.json?id='+woeid,
			headers:header
		}
		request(options,(err,res,body)=>{
			if(err)
			{
				reject(err);
			}
			else
			{
				var list=JSON.parse(body)[0].trends;
				var res=[];
				for(let i=0;i<list.length;i++)
				{
					if(list[i].promoted_content==null)
					{
						let twtvol=list[i].tweet_volume;
						if(list[i].tweet_volume==null)
						{
							twtvol=0;
						}
						res.push({name:list[i].name,url:list[i].url,tweet_volume:twtvol});
					}
				}
				res.sort((a,b)=>{
					return b.tweet_volume-a.tweet_volume;
				})
				resolve(res);
			}
			
		});
	});
};
module.exports={
	route,
	findOne,
	addUser,
	findById,
	randomHex,
	addUserToTopic,
	removeUserFromTopic,
	setTrends,
	getTrends,
	getwoeid,
	getPlaceTrends,
	findTopic,
	addNewTopic,
	addMsgToTopic,
	mergeAllTopics
}