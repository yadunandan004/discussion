import io from 'socket.io-client';
function enableSocket()
{
	var host='http://localhost:8080';
	if(process.env.NODE_ENV === 'production')
	{
		host='https://morning-basin-11510.herokuapp.com';
	}
	return io(host+'/chatter',{transports:['websocket']});
}
export default enableSocket;