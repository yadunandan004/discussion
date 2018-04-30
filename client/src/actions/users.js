
export  function addNewUser(data){
	
	let action={};
	action.payload={};

	action.type='ADD_USER';

	action.payload.loggedIn=true;
	
	action.payload.profile={
		location:data.location,
		profileId:data.profileId,
		profilePic:data.profilePic,
		name:data.name
	};
	return action;
}
export  function removeUser()
{
	return({type:'DELETE_USER'})	;
}