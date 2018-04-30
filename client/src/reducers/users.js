import initialState from './initState';

function userReducer(state=initialState,action){
	let nextState=Object.assign({},state);
	switch(action.type)
	{
		case 'ADD_USER':
		nextState={...nextState,...action.payload};		
			return nextState;
		
		case 'DELETE_USER':
			nextState.loggedIn=false;
			nextState.profile={};

			return nextState;
		break;	
		default:
			return nextState;
	}
}
export default userReducer;