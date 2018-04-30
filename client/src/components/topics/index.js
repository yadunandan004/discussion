import React from 'react';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import './topics.css';
class Topic extends React.Component{
	constructor(props)
	{
		super(props);
		this.enterChatRoom=this.enterChatRoom.bind(this);
		this.createTopic=this.createTopic.bind(this);
	}
	// proceed to next stage i.e chatroom
	enterChatRoom(ele)
	{
		this.props.selectTopic(
		{
			topic:ele,
			users:[this.props.data.userReducer.profile]
		});
		// axios.post('/getnews',{title:ele.name})
		// .then((news)=>{
			
		// })
		// .catch((error)=>{
		// 	console.log(error);
		// });
		
	}
	createTopic()
	{
		let topicName=document.getElementById("new-topic").value;
		document.getElementById("new-topic").value="";
		this.enterChatRoom({name:topicName,id:this.props.data.userReducer.profile.profileId,source:'user'});	
	}
	componentWillMount() {
		this.props.fetchAllTopics(this.props.data.userReducer.profile.location);
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.data.topicReducer.topics.twitter.length===0)
		{
			this.props.fetchAllTopics(this.props.data.userReducer.profile.location);
		}
	}
	componentDidMount() {
		$("#create-btn").click(function(e){
			$("#new-topic").addClass("move-down")
		})
		let _=this;
		$("#new-topic").keyup(function(event){

			event.preventDefault();
			if(event.keyCode===13)
			{
				_.createTopic();
			}
		})
	}
	render()
	{
		
			let topicSelected= this.props.data.topicReducer.selectedTopic;
			if(typeof topicSelected!=="undefined")
			{
			return(
				<Redirect to={`/topics/:${topicSelected.topic.name}`} />
				)
			}
		return (
			<div >
				<CreateTopic />
{/*				{this.props.data.topicReducer.topics.user.length>0?
				<div>
				<div className="rulerDiv"></div>
				<h2>User created topics</h2>
					<TopicList topics={this.props.data.topicReducer.topics.user} color={"success"}/>
					
					</div>:null  }  */}
				{/*create a thick horizontal line*/}
				<div className="rulerDiv"></div>
				{/*twitter trends section*/}
				<div className="trends">
					<h2> Trending right now</h2>
					<TopicList topics={this.props.data.topicReducer.topics.twitter} enterChat={this.enterChatRoom}/>
				</div>
			</div>
			)

	}
}
//list of topics obtained from twitter section
function TopicList(props)
{
	//iterating through each list obtained as topics and creating a list item
	let listitem=props.topics.map((ele,idx)=>{
				return(

					<li key={idx} onClick={()=>{props.enterChat(ele)}}>
						{ele.name}
					</li>
				)
			});
	return(
		<div id="topic-list">
			<ul >
				{listitem}
			</ul>
		</div>
		)
}
//create new topic section
function CreateTopic()
{
	return(
		<div className="create-topic">
			<h2> Create a Topic</h2>
			<div className="input-sec">
			<button id="create-btn">
				 <i className="fa fa-plus"></i> Topic:
				</button>
			<input type="text" id="new-topic" placeholder="Your Topic" autoFocus />
			</div>
		</div>
		)
}
export default Topic;