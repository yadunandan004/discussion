import React from 'react';
import {Row,Col} from 'react-bootstrap';
import {Redirect,Link} from 'react-router-dom';
import './banner.css';
class Banner extends React.Component{
	constructor(props) {
		super(props);

	}
	componentDidUpdate() {		
	}
	
	render()
	{
		if(!this.props.data.userReducer.loggedIn)
		{
			if(this.props.location.pathname!=="/")
			{
				return(
				<Redirect to='/' />
				);
			}
			else
			{
				return(
					<NavBar loggedIn={false} signOut={null} rmTopic={null}/>
					)
			}
		}
		else
		{
			
			return(
			<NavBar loggedIn={true} signOut={this.props.signOutUser} rmTopic={this.props.removeTopics}/>
			)
		}
		
	}
}
//creating Navbar 
function NavBar(props)
{
	return(			
				<div className="nav-bar">
						<ul>
							<li>
								<h1>{props.loggedIn?<Link to='/topics' onClick={props.rmTopic}>Discussion</Link>:"Discussion"}</h1>
							</li>
						
						{/*logout btn in navbar to appear only if logged in*/}
						{
							props.loggedIn ?
							<li>
							<button  className="active" onClick={props.signOut}><i className="fa fa-sign-out" aria-hidden="true"></i> LogOut</button>
							</li>
							:
							null
						}
						</ul>
				</div>
		)
}
export default Banner;