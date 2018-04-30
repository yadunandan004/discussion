import {auth} from '../auth';
import axios from 'axios';
// handling all firebaase authentication

// sign in handler
export  function fetchUser(provider)
{
	 return auth.signInWithPopup(provider)
	 .then((result)=>{
		if(result.additionalUserInfo.profile.location==="")
		{
			result.additionalUserInfo.profile.location="USA";
		}
		return axios.post('/addUser',
 		{
 			accessToken:result.credential.accessToken,
 			secret:result.credential.secret,
 			profile:result.additionalUserInfo.profile
 		})
	})
	.catch((error)=>{
			console.log(error);
	})
}

//sign out handler
export function signOut()
{
	return auth.signOut();
}

export function fetchTopics(location)
{	
	return axios.post('/rooms',{
		"location":location
	})
}

