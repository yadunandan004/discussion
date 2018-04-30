import {connect} from 'react-redux';
import Banner from '../components/banner/index.js';
import {removeUser} from '../actions/users';
import {removeSelectedTopic} from '../actions/topics';
import {signOut} from '../helpers';

const mapStateToProps=(state)=>({
	data:state
});
const mapDispatchToProps=(dispatch)=>{
	return{
		signOutUser:()=>{
			localStorage.removeItem('discussionToken');
			// console.log('CHECKING!!');
			// console.log(cookies.get('discussionToken'));
			signOut().then((result)=>{
				
				dispatch(removeUser(result));
				dispatch(removeSelectedTopic());
			})
			.catch((error)=>{
				console.log(error);
			});
		},
		removeTopics:()=>{
			dispatch(removeSelectedTopic());
		}	
	}
}

const bannerContainer=connect(mapStateToProps,mapDispatchToProps)(Banner);

export default bannerContainer;