import React from 'react';
import {Redirect} from 'react-router';
import {twitterProvider} from '../../auth';
import $ from 'jquery';
import './login.css';
import axios from 'axios';


class Login extends React.Component{
	constructor(props) {
		super(props);
		this.login=this.login.bind(this);	
	}
	componentWillMount() {
		let token=localStorage.getItem('discussionToken');
		
		if( typeof token!=="undefined")
		{	
			axios.post('/checkUser',{token})
			.then((profile)=>{
				if(typeof profile.data.profileId!=="undefined")
				{
					this.props.autoLoginUser(profile.data);
				}
			})
		}
	}
	login()
	{
		$("#login").css('transform','translateX( -100% ) rotateY( 180deg )');
		let scope=this.props; 
		setTimeout(function(){
			scope.addNewUser(twitterProvider);
		},500);
	}
	render()
	{
	    	if(this.props.data.userReducer.loggedIn)
	    	{
	    		return(<Redirect push to='/topics' />)
	    	}
	    	else
	    	{
	    		return(
	    			<div className="container">	
				      <LoginBtn click={this.login} />
			      	</div>
	    		)
	    	}
	    	
	}
}
Login.defaultProps={
  btnClass:'',
  btnName:''
};
function LoginBtn(props)
{
			return(
				<div className="login-section">
				<div className="flipper">			
					<div id="login" onClick={props.click}>
						<div className="front"><span id="twt" className="fa fa-twitter"></span> Sign In</div>
						<div className="back"><span id="twt" className="fa fa-twitter"></span>Loading..</div>
					</div>
				</div>
				</div>
					
			)
}
export default Login;