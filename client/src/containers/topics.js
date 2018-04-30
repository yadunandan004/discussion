import { connect } from 'react-redux';
import Topics from '../components/topics/index.js';
import {fetchTopics} from '../helpers';
import {addAllTopics,pickTopic} from '../actions/topics';
const mapStateToProps=(state)=>({
	data:state
});
const mapDispatchToProps=(dispatch)=>({
		fetchAllTopics:(location)=>{
			fetchTopics(location).then((result)=>{
				dispatch(addAllTopics(result));	
			})
			.catch((err)=>{
				console.log(err);
			})
		},
		selectTopic:(topicDetails)=>{
			dispatch(pickTopic(topicDetails));	
		}
})
const topicsContainer = connect(mapStateToProps,mapDispatchToProps)(Topics);

export default topicsContainer;