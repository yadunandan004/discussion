'use strict';
const h=require('../helpers');
module.exports=(io,app)=>{
	let allrooms=app.locals.chatrooms;

	io.of('/roomslist').on('connection',socket =>{
		//console.log('connected to client');
		socket.on('getChatrooms',()=>{
			socket.emit('chatRoomsList',JSON.stringify(allrooms));
			
		socket.on('createNewRoom',(data)=>{
				//check to see if room exists
				//if not create and broadcast to everyone
				if(!h.findRoomByName(allrooms,data))
				{
					allrooms.push({
						room:data,
						roomID:h.randomHex(),
						users:[]
					});

					//emit an updated list to creator
					socket.emit('chatRoomsList',JSON.stringify(allrooms));
					//broadcast the same to everyone else as well
					socket.broadcast.emit('chatRoomsList',JSON.stringify(allrooms));
				}
			});	
		});
	});

	io.of('/chatter').on('connection',socket=>{
		//Join a chatroom
		socket.on('join', data =>{
			let usersList= h.addUserToRoom(allrooms,data,socket);
			socket.broadcast.to(data.roomID).emit('updateUsersList',JSON.stringify(usersList.users));
			socket.emit('updateUsersList',JSON.stringify(usersList.users));
		});
		socket.on('disconnect',()=>{
			let room=h.removeUserFromRoom(allrooms,socket);
			if(room !== undefined)
			{
				socket.broadcast.to(room.roomID).emit('updateUsersList', JSON.stringify(room.users));	
			}
		});
		socket.on('newMessage',data=>{
			//console.log(data.roomID);
			socket.broadcast.to(data.roomID).emit('inMessage',JSON.stringify(data));
		});
		socket.on('newImgMessage',data=>{
			//console.log(data.roomID);
			socket.broadcast.to(data.roomID).emit('inImgMessage',JSON.stringify(data));
		});
	});
}