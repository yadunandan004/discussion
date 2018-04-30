import {Button,Row,Col,Image} from 'react-bootstrap';
import { Redirect } from 'react-router';
import React from 'react';
import './room.css';
import Graph from '../ugraph/index.js';
import News from '../news/index.js';
import chatterSocket from '../../helpers/socket.js';
import axios from 'axios';

var udata={
  "nodes":[
    {
        "hero": "Spider-Man",
        "name": "Peter Benjamin Parker", 
        "link": "http://marvel.com/characters/54/spider-man",
        "img":  "http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_spiderman.png",
        "size": 40000,
        "group":1
      },
      {
        "hero": "CAPTAIN MARVEL",
        "name": "Carol Danvers", 
        "link": "http://marvel.com/characters/9/captain_marvel",
        "img":  "http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_captainmarvel.png",
        "size": 40000,
        "group":2
      },
      {
        "hero": "HULK", 
        "name": "Robert Bruce Banner",
        "link": "http://marvel.com/characters/25/hulk",
        "img":  "http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_hulk.png",
        "size": 40000,
        "group":3
      }
  ]
};
 udata.links=[]
 for (let i=0;i<udata.nodes.length;i++)
 {
  for (let j=i+1;j<udata.nodes.length;j++)
  {
    udata.links.push({source:udata.nodes[i],target:udata.nodes[j],value:1});
  }
 }
class Room extends React.Component{
	constructor(props) {
		super(props);
		this.chat=this.chat.bind(this);
		if(this.props.data.topicReducer.selectedTopic!==undefined)
		{
			localStorage.setItem('selectedTopic', JSON.stringify(this.props.data.topicReducer.selectedTopic));
			this.data=this.props.data.topicReducer.selectedTopic;
		}
		else
		{
			this.data=JSON.parse(localStorage.getItem('selectedTopic'));
			console.log(this.data);
		}
		// this.topic=this.props.data.topicReducer.selectedTopic.topic.name;
		this.state={data:{},newsLoaded:false};
	}
	componentWillMount() {
		axios.post('/getnews',{title:this.data.topic.name})
		.then((news)=>{
			this.props.loadNews(news.data);
		})
		.catch((error)=>{
			console.log(error);
		});
		this.socket=chatterSocket();
		this.socket.emit('join',{user:this.props.data.userReducer.profile,topic:this.data.topic.name});
		this.socket.on('updateUsersList',(data)=>{
			this.props.userUpdate(data);
		})
	}
	componentWillUnmount() {
		this.socket.disconnect();
	}
	componentWillReceiveProps(nextProps)
	{
		if(typeof nextProps.data.topicReducer.selectedTopic.news!="undefined") this.setState({newsLoaded:true});
	}
	componentDidMount() {
		
		this.updateData();
		document.getElementById("chat-text")
		.addEventListener("keyup",(event)=>{
			event.preventDefault();
			if(event.keyCode===13)
			{
				document.getElementById("submit-btn").click();
			}
		})
		this.socket.on('inMessage',(data)=>{
			this.props.sendChatMsg(JSON.parse(data));
		});
	}
	updateData()
	      {
	        this.setState({data:udata});
	      }
	chat()
	{
		let msg=document.getElementById("chat-text").value;
		let topic=this.data.topic.name;
		let user=this.props.data.userReducer.profile;
		let data={
			msg,
			topic,
			user
		};
		this.socket.emit('newMessage',data);
		this.props.sendChatMsg(data);
		document.getElementById("chat-text").value="";
	}
	render() {
		let user=this.props.data.userReducer.profile;
		let chatMessages=this.data.messages.map((ele,idx)=>{
					if(ele.user.profileId===user.profileId)
					{
						return(
							<Row key={idx}>
								<div className="textBox-right" >
									<span><Image src={ele.user.profilePic} circle/></span>
									<div className="chatMsg">{ele.msg}</div>
								</div>
							</Row>
						)
					}
					else
					{
						return(
							<Row key={idx}>
								<div className="textBox-left" >
									<div className="chatMsg">{ele.msg}</div>
									<span><Image src={ele.user.profilePic} circle/></span>
								</div>
							</Row>
						)
					}
					
				})
		return(
			<div>
				
					<div>
						<div className="title">{this.data.topic.name}</div>
					</div>					
					<div id="chat-box">	
						<div id="text-box">
							{chatMessages}
						</div>
						<div className="chat-ip">
							<textarea  type="text"   id="chat-text"/>
							<Button bsStyle="success" bsSize='large' id="submit-btn" onClick={this.chat}><i className="fa fa-paper-plane" aria-hidden="true"></i></Button>
						</div>
					</div>		
					<Graph nodes={udata.nodes} links={udata.links}/>
					{this.data.topic.source==="user"?null: <NewsSection data={this.data} newsLoaded={this.state.newsLoaded}/>}
				</div>
			)
	}
}
function NewsSection(props)
{
	return(
				<div>
				<div className="news-title">
						<h3 >Related News</h3>
					</div>
					{
						props.newsLoaded?
						<News data={props.data}/>:<h3>Loading Articles,Please wait..</h3>
					}
					</div>
	)
}
export default Room;