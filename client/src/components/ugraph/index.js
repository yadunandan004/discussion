import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

import './ugraph.css';
var w = 500;
var h = 500;
var maxNodeSize = 50;
var svg = d3.select("svg");
var simulation = d3.forceSimulation()
                  .force("link",d3.forceLink().id(function(d){ return d.hero}).distance(function(d){
                      return Math.max(50,Math.abs(d.source.group-d.target.group)*100)
                     }).strength(1))
                  .force("collide",d3.forceCollide( function(d){return 30 }).iterations(16) )
                  .force("charge",d3.forceManyBody())
                  .force("center",d3.forceCenter(w/2,h/2));


 function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
  var enterNode=(sel)=>{
            sel
            .classed("node",true)
            .attr("cx",25)
            .attr("cy", 25)
            .attr("r", 25)
            .attr("stroke",function(d){
              if(d.group===1){
                return "#d13423";
              }
              if(d.group===3)
              {
                return "#244399";
              }
              return "#737477";  
            })
            .attr("stroke-width",4)
            .style("fill", function(d,i){return "url(#gravatar" +i+ ")";})
            .call(d3.drag()
                  .on("start",dragstarted)
                  .on("drag",dragged)
                  .on("end",dragended));
  }
  var updateNode=(sel)=>{
    sel.attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";

        });
  }
  var enterLink=(sel)=>{
              sel
              .classed("link",true)
              .attr("stroke","#000")
             .attr("stroke-width",function(d){return d.value;})
              .merge(sel);
  }
  var updateLink=(sel)=>{
  sel.attr("x1", (d) => (d.source.x+25))
    .attr("y1", (d) => (d.source.y+25))
    .attr("x2", (d) => (d.target.x+25))
    .attr("y2", (d) => (d.target.y+25));
};
var node,link;
 var updateGraph = () => {
  
  node.selectAll('.node').call(updateNode);
  link.selectAll('.link').call(updateLink);
};
var Graph=React.createClass({
  componentWillMount(){
    this.pattern=this.props.nodes.map((u,i)=>{                     
                      return(
                        <pattern key={i} id={"gravatar"+i} width={50} height={50} patternUnits={"userSpaceOnUse"}>
                          <image href={u.img} width={50} height={50} x={0} y={0}></image>
                        </pattern>
                      )
            });
  },
  componentDidMount(){
  node=d3.select(ReactDOM.findDOMNode(this.refs.node));
  link=d3.select(ReactDOM.findDOMNode(this.refs.link));
  simulation.on("tick",updateGraph);
  },
    shouldComponentUpdate(nextProps) {
    this.node=d3.select(ReactDOM.findDOMNode(this.refs.node)).selectAll('.node');
  this.link=d3.select(ReactDOM.findDOMNode(this.refs.link)).selectAll('.link');



this.node.data(nextProps.nodes,function(d){return d.id;}).enter().append("circle").call(enterNode);
            this.node.exit().remove();
            this.node.call(updateNode);
            this.node.append("title")
            .text(function(d) { return d.hero; });
                       
             this.link.data(nextProps.links,function(d){return d.source.id +"-"+d.target.id;}).enter()
             .append("line").call(enterLink);
             this.link.exit().remove();
             this.link.call(updateLink);

    simulation.nodes(nextProps.nodes);
    simulation.force("link").links(nextProps.links);
    simulation.restart();
    return false;
  },

  render(){
    return(
      <div id="graph-section">
          <h3>User Graph</h3>
          <svg id="graph">
            <defs>
              {this.pattern}
            </defs>
            <g className="links" ref="link" />
            <g className="nodes" ref="node" />
          </svg>
          </div>
      )
  }
})

export default Graph;




 
 
