"use strict";
import React from 'react';
import {Navbar,Nav,NavItem,MenuItem,Panel,Input,Button,Breadcrumb,BreadcrumbItem,Pagination} from 'react-bootstrap';
import $ from 'jquery';
import _ from 'underscore';


const viewerStyle = {
	width:"100%",
	height:"auto"
};
const Viewer =  React.createClass({
	getInitialState() {
		let {from,vid,page} = this.props.params
	    return {
	    	init:false,
	    	list:[],
	    	from:from,
	    	vid:vid,
	    	page:parseInt(page)||1
	    };
	    console.log('getInitialState');
	},
	componentWillMount(){
	    console.log('componentWillMount');
		var url = '/api/volumns/'+this.state.vid;
		$.get(url,function(result){
			var option = _.pick(result,'list','_id','title');
			this.setState(option);
		}.bind(this));
	},
	_toPage(page){
		// if(typeof page !== 'number'){
		// 	page = 1;
		// }
		var url = '#/viewer/'+this.state.from+'/'+this.state.vid+'/'+page;
		window.location.hash = url;
		this.setState({page:page});
	},
	_next(event,v,_event){
		var page = this.state.page;
		if(event.target.width > (event.clientX * 2)){
			page--;
		}else{
			page++;
		}
		if(page >= 1 && page<=this.state.list.length){
			this._toPage(page);
		}
	},
	_handleSelect(event, selectedEvent){
		var page = parseInt(selectedEvent.eventKey);
		this._toPage(page);
	},
	render() {
		var Viewer;
		if(this.state.list && this.state.list.length){
			Viewer = <img onClick={this._next} src={'/asset/'+this.state.vid + '/' + this.state.list[(this.state.page-1)]} style={viewerStyle}/>;
		}else{
			Viewer = <div/>
		}
		var from = this.state.from;
		var queries = from.split('-');
		var last = '#/?'
		_.each(queries,function(qs){
			if(last){
				last +='&';
			}else{
				last = '#/?';
			}
			var pairs = qs.split('_');
			last+=pairs.join('=');
		});
		return (<div className="row">
			<Breadcrumb key="bread">
			    <BreadcrumbItem  href="#">
			      列表
			    </BreadcrumbItem>
			    <BreadcrumbItem  href={last}>
			      分类
			    </BreadcrumbItem>
			    <BreadcrumbItem onClick={this._toPage.bind(this,1)}>
			      {this.state.title}
			    </BreadcrumbItem>
			    <BreadcrumbItem  active>
			      {this.state.page}页
			    </BreadcrumbItem>
			  </Breadcrumb>
			  {Viewer}
			  <Pagination
					key="pager"
			        prev
			        next
			        first
			        last
			        ellipsis
			        items={this.state.list.length}
			        maxButtons={5}
			        activePage={this.state.page}
			        onSelect={this._handleSelect} 
			        style={{"paddingLeft":"15px"}}/>
          </div>)
	}
})

export default Viewer;