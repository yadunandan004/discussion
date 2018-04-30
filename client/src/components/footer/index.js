import React from 'react';
import {Row,Col} from 'react-bootstrap';
import './footer.css';
 class Footer extends React.Component{
	render()
	{
		return(
			<div>
			<div className="dummy">
			</div>
				<footer className="navbar-fixed-bottom">
					<Row>
						<Col xs={3} md={3} lg={3}>
							This is a hobby project developed by Yadu Nandan. 
						</Col>
						<Col >
						        <a href="http://github.com/yadunandan004" ><span className="fa fa-github fa-2x icons-arrange adjust-icon" aria-hidden="true" ></span></a>
						          <a href="http://twitter.com/yaduanna" ><span className="fa fa-twitter fa-2x icons-arrange" aria-hidden="true" ></span></a>
						</Col>
					</Row>	
				</footer>
			</div>
			)
	}
}
export default Footer;