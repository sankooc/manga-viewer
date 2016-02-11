"use strict";
import React from 'react';
import {Modal,OverlayTrigger,Panel,Input,Button,Breadcrumb,BreadcrumbItem,Pagination} from 'react-bootstrap';
var ReactTags = require('react-tag-input').WithContext;
import $ from 'jquery';
import _ from 'underscore';


const viewerStyle = {
	width:"100%",
	height:"auto"
};
const editorStyle = {
	"position": "absolute",
    "fontSize": "20px"
};
const Viewer =  React.createClass({
	getInitialState() {
		let {from,vid,page} = this.props.params
	    return {
	    	init:false,
	    	list:[],
	    	tags:[],
	    	_tags:[],
	    	from:from,
	    	vid:vid,
	    	page:parseInt(page)||1
	    };
	},
	componentWillMount(){
		var url = '/api/volumns/'+this.state.vid;
		$.get(url,function(result){
			var option = _.pick(result,'list','_id','title','tags');
			var inx = 1;
			_.each(option.tags,function(tag){
				option._tags = option._tags || [];
				option._tags.push({
					id:(option._tags.length+1),
					text:tag
				})
			});
			this.setState(option);
		}.bind(this));
	},
	_openEditor(){
		var vid = this.state.vid;
		this.setState({showModal:true});
	},
	_closeEditor(){
		this.setState({showModal:false});
	},
	_commitEditor(){
		var title = this._nameInput.refs.input.value;
		var option = {
			title:title,
			tags: this.state._tags.map(function(_tag){return _tag.text}) || []
		};
		var url = '/api/volumns/'+this.state.vid;
		var self = this;
		$.ajax(url,{method:"PUT",data:option})
		.done(function(ret){
			if(ret.ok){
				var option = {title:title};
				self.setState(option);
			}
		})
		.always(function(){
			self.setState({showModal:false});
		});
	},
	_toPage(page){
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
	_deleteTag(i){
		var _tags = this.state._tags;
        _tags.splice(i, 1);
        this.setState({_tags: _tags});
	},
	_addTag(tag){
		var _tags = this.state._tags;
        _tags.push({
            id: _tags.length + 1,
            text: tag
        });
        this.setState({_tags: _tags});
	},
	handleDrag(tag, currPos, newPos){
		var _tags = this.state._tags;
        _tags.splice(currPos, 1);
        _tags.splice(newPos, 0, _tags);
        this.setState({ _tags: _tags });
	},
	render() {
		var Viewer;
		if(this.state.list && this.state.list.length){
			Viewer = <div><span onClick={this._openEditor} style={editorStyle}><i className="fa fa-pencil-square-o"></i></span><img onClick={this._next} src={'/asset/'+this.state.vid + '/' + this.state.list[(this.state.page-1)]} style={viewerStyle}/></div>;
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
		var _tags =  this.state._tags;
		var suggestions: ["Banana", "Mango", "Pear", "Apricot"];
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
			        <div className="clearfix"></div>
			   <Modal show={this.state.showModal} onHide={this._closeEditor}>
		          <Modal.Header closeButton>
		            <Modal.Title>{'Edit '+this.state.vid}</Modal.Title>
		          </Modal.Header>
		          <Modal.Body>
		          	<Input type="text" addonBefore="Title :" defaultValue={this.state.title} ref={(ref) => this._nameInput = ref}/>
		          	<ReactTags tags={this.state._tags}
                   		suggestions={suggestions}
	                    handleDelete={this._deleteTag}
	                    handleAddition={this._addTag}
	                    handleDrag={this.handleDrag}/>
                    <div className="clearfix"></div>
		          </Modal.Body>
		          <Modal.Footer>
		          	<Button onClick={this._commitEditor}>Commit</Button>
		            <Button onClick={this._closeEditor}>Close</Button>
		          </Modal.Footer>
		        </Modal>
          </div>)
	}
})

export default Viewer;