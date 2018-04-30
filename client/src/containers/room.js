import {connect} from 'react-redux';
import Room from '../components/room/index.js';
import {sendMessage,updateUsers,addNews} from '../actions/topics';
// import {chatterSocket} from '../helpers';
const mapStateToProps=(state)=>({
	data:state
});
const mapDispatchToProps=(dispatch)=>{
	return{
		sendChatMsg:(msg)=>{
			dispatch(sendMessage(msg));
		},
		userUpdate:(users)=>{
			dispatch(updateUsers(users));
		},
		loadNews:(news)=>{
			dispatch(addNews(news));
		}	
	}
}

const roomContainer=connect(mapStateToProps,mapDispatchToProps)(Room);

export default roomContainer;