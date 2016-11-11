'use strict';
const router=require('express').Router();
const db=require('../db');
const crypto=require('crypto');
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
let addUser=(profile)=>{
	return new Promise((resolve,reject)=>{
		let newChatUser= new db.userModel({
			profileId:profile.id,
			fullName:profile.displayName,
			profilePic:profile.photos[0].value
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
//middleware to check whether user is authenticated or not
let isAuthenticated=(req,res,next)=>{
	if(req.isAuthenticated())
	{
		next();
	}
	else
	{
		res.redirect('/');
	}
}

let findRoomByName=(allrooms,room)=>{
	let findRoom= allrooms.findIndex((element,index,array)=>{
		let croom=element.room;
		let re= new RegExp(/croom/i);
		return re.test(room);
	});
	return findRoom > -1 ? true:false;
}
//function to generate a unique room ID

let randomHex = ()=>{
	return crypto.randomBytes(24).toString('hex');
}

//Add user to a chatroom
let addUserToRoom=(allrooms,data,socket)=>{
	let getRoom = findRoomById(allrooms,data.roomID);
	if(getRoom !== undefined){
		//get users active ID (objectID as used in session)
		let userID= socket.request.session.passport.user;
		//check to see if the user exists
		let checkUser=getRoom.users.findIndex((element,index,array)=>{
			if(element.userID === userID)
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
			getRoom.users.splice(checkUser,1);
		}
		
		getRoom.users.push({
			socketID:socket.id,
			userID,
			user: data.user,
			userPic:data.userPic
		});

		socket.join(data.roomID);
		return getRoom;
	}
}

let removeUserFromRoom=(allrooms,socket)=>{
		for(let room of allrooms)
		{
			let findUser= room.users.findIndex((element,index,array)=>{
			if(element.socketID === socket.id)
			{
				return true;
			}
			else{
				return false;
			}
		});
		if(findUser > -1)
		{
			socket.leave(room.roomID);
			room.users.splice(findUser,1);
			if(room.users===undefined)
			{
				room.users=[];
			}
			return room;
		}
	}
}

let findRoomById=(allrooms,roomID)=>{
	return allrooms.find((element,index,array)=>{
		if(element.roomID===roomID)
		{
			return true;
		}
		else{
			return false;
		}
	})
}
module.exports={
	route,
	findOne,
	addUser,
	findById,
	isAuthenticated,
	findRoomByName,
	randomHex,
	findRoomById,
	addUserToRoom,
	removeUserFromRoom
}