import initialState from './initState';
function topicReducer(state=initialState,action){
	let nextState=Object.assign({},state);
	switch(action.type)
	{
		case 'ADD_TOPICS':
			let topics={}
			topics.twitter=action.payload.data.twitter.map((ele)=>{
				return {name:ele.name,source:'twitter',creatorId:'twitter.com'};
			})
			topics.user=action.payload.data.user;
			nextState.topics=topics;
			return nextState;

		case 'ADD_TOPIC':

		break;
		case 'SELECT_TOPIC':
			nextState={...nextState,...action.payload};
			nextState.selectedTopic.messages=[];
			
			return nextState;
		case 'CLEAR_TOPICS':
			delete nextState.selectedTopic;
			nextState.topics.twitter=[];
			nextState.topics.user=[];
			return nextState;
		
		case 'UPDATE_USERS':
			nextState.selectedTopic.users=action.payload.users;
			nextState.selectedTopic.messages=action.payload.messages;
			return nextState;
		
		case 'UPDATE_NEWS':
			nextState.selectedTopic.news=action.payload.news;
			return nextState
		case 'SEND_MESSAGE':
			nextState.selectedTopic.messages.push(action.payload);
			return nextState;
		default:
		return nextState;		
	}
}
export default topicReducer;