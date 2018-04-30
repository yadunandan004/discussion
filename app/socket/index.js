'use strict';
const h=require('../helpers');
module.exports=(io,app)=>{
	let allrooms=app.locals.chatrooms;
	io.of('/chatter').on('connection',socket=>{
		//Join a chatroom
		socket.on('join', data =>{
			 h.addNewTopic(data)
				.then(result=>{
					return h.addUserToTopic(data,socket);
				})
				.then(obj=>{
					socket.join(obj.name);
					socket.broadcast.to(obj.name).emit('updateUsersList',obj);
					socket.emit('updateUsersList',obj);
				});
		});
		socket.on('disconnect',()=>{
			console.log('USER DISCONNECTED!!!!!')
			h.removeUserFromTopic(socket,(topic)=>{
					socket.leave(topic.name);
					socket.broadcast.to(topic.name).emit('updateUsersList', topic);
			})
		});
		socket.on('newMessage',data=>{
			h.addMsgToTopic(data)
			.then((res)=>{
				socket.broadcast.to(data.topic).emit('inMessage',JSON.stringify(data));
			})
			
		});
		socket.on('newImgMessage',data=>{
			//console.log(data.roomID);
			socket.broadcast.to(data.topic).emit('inImgMessage',JSON.stringify(data));
		});
	});
}