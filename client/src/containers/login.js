import {connect} from 'react-redux';
import Login from '../components/login/index.js';
import {addNewUser} from '../actions/users';
import {fetchUser} from '../helpers';
const mapStateToProps=(state)=>({
	data:state
});
const mapDispatchToProps=(dispatch)=>{
	return{
		addNewUser:(provider)=>{
			fetchUser(provider)
			.then((data)=>{
				let token=data.data.token;
				if(typeof token !== "undefined")
				{
					localStorage.setItem('discussionToken',token);
				}
		 		dispatch(addNewUser(data.data));	
		 	})
			.catch((error)=>{
				console.log(error);
			})
		},
		autoLoginUser:(data)=>{
			dispatch(addNewUser(data));
		}	
	}
}

const loginContainer=connect(mapStateToProps,mapDispatchToProps)(Login);

export default loginContainer;