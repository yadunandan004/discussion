import React from 'react';
import './news.css';
class News extends React.Component{
	constructor(props)
	{	
		super(props);
		this.news=this.props.data.news.map((ele,idx)=>{
			if(typeof ele.title!='undefined' && typeof ele.description!=undefined && typeof ele.src!=undefined)
			{
				return(
					<div className="news-article" key={idx}>
						
						<h5>{ele.title}</h5>
						<a target="_blank" href={ele.src} >Link To Article</a>

					</div>
				)
			}
			else{
				return null;
			}	
		})
	}
	render()
	{
		return(
			<div id="news-section" >
				<div className="scroll">
					{this.news}
				</div>
			</div>
			)
	}
}
export default News;