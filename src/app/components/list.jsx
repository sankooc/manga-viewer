"use strict";
import React from 'react';
import {Navbar,Nav,NavItem,MenuItem,Panel,Input,Button,Breadcrumb,BreadcrumbItem,Pagination} from 'react-bootstrap';
import Loading from './loading';
import $ from 'jquery';
import _ from 'underscore';


const thumb_style = {
	"height":"200px",
	"width":"100%",
	"backgroundImage": "url('images/back.svg')",
    "backgroundRepeat": "no-repeat",
    "backgroundSize": "cover"
};
const titleStyle = {
	"width": "80%",
    "display": "inline-block",
    "overflow": "hidden",
    "textOverflow": "ellipsis",
    "whiteSpace": "nowrap"
};

const List =  React.createClass({
	getInitialState() {
		let { query } = this.props.location;
		var option = {page:1,per:18,init:false,count:0,items:[]};
		_.extend(option,_.pick(query,'page','per','sort','kw'));
		option.page = parseInt(option.page);
		option.per = parseInt(option.per);
	    return option;
	},
	componentWillMount(){
  		this._toRoute(_.clone(this.state));
	},
	_toHome(){
		const option = {
			per:18,
			page:1
		};
		this._toRoute(option);
	},
	_toRoute(option){
		var page = option.page;
  		var per = option.per;
  		var url = '/api/volumns?page='+page+'&per='+per;
  		if(option.sort){
  			url +='&sort='+option.sort;
  		}
  		if(option.kw){
  			url +='&kw='+option.kw;
  		}
  		this.setState({init:false});
		$.get(url, function(result){
  			var _option = _.pick(result,'count','items');
  			_option = _.extend(option,_option);
  			_option.init = true;
  			_option.items.map(function(item){
  				item.cover = '/asset/'+item.vid+'/'+item.cover;
  			})
  			this.setState(_option);
  		}.bind(this));
	},
	_handleSelect(event, selectedEvent){
		var _option = _.pick(this.state,'per','sort','kw');
		_option.page = parseInt(selectedEvent.eventKey);
		this._toRoute(_option);
		var _url = '#/?page='+_option.page+'&per='+_option.per;
		if(_option.sort){
			_url+='&sort='+_option.sort
		}
		if(_option.kw){
			_url+='&kw='+_option.kw
		}
		window.location.hash = _url;
	},
	_search(){
		var val = this.searchInput.refs.input.value;
		if(val){
			var url = '#/?page=1&per=18&kw='+val;
			window.location = url;
			window.location.reload();
		}
	},
	_toDetail(item){
		var from = 'page_'+this.state.page;
		from +='-per_'+this.state.per;
		if(this.state.sort){
			from +='-sort_'+this.state.sort;
		}
		if(this.state.kw){
			from +='-kw_'+this.state.kw;
		}
		return "#/viewer/"+from+"/"+item.vid+"/1";
	},
	render() {
		var Content;
		if(this.state.init){
			var Content = [];
			var ext;
			if(this.state.kw){
				ext = <BreadcrumbItem active>
	    		{this.state.kw}
	    		</BreadcrumbItem>
			}else{
				ext = <BreadcrumbItem active>
	    		所有
	    		</BreadcrumbItem>
			}
			const breadcrumbInstance = (
			  <Breadcrumb key="bread" style={{"backgroundColor":"white"}}>
			    <BreadcrumbItem  href="#" onClick={this._toHome}>
			      Home
			    </BreadcrumbItem>
			    { ext }
			  </Breadcrumb>
			);
			Content.push(breadcrumbInstance);
			var items = this.state.items;
			var cnt = 3;
			var rows = ~~((items.length-1) / cnt) +1;
			for(var i=0;i<rows;i++){
				var _items = items.slice(i*cnt,(i+1)*cnt);
				var _row = <div key={i} className="row">
					{
	  		    		_items.map(item =>
	  		    			<Panel key={item.vid} className="col-md-3 col-md-offset-1" footer={<div><span style={titleStyle}>{item.title}</span><span style={{"float":"right"}}>共{item.count}页</span></div>} style={{padding:"0px",width:"30%",marginLeft:"2.5%"}}>
	  		    				<a href={this._toDetail(item)} ><img src={item.cover} style={thumb_style}/></a>
				   			</Panel>)
	  				}
				</div>
				Content.push(_row);
			}
			var total = ~~((this.state.count-1)/this.state.per) + 1;
			const pager = <Pagination
					key="pager"
			        prev
			        next
			        first
			        last
			        ellipsis
			        items={total}
			        maxButtons={5}
			        activePage={this.state.page}
			        onSelect={this._handleSelect} 
			        style={{"paddingLeft":"15px"}}/>;
			Content.push(pager);



		}else{
			Content = <Loading/>;
		}
		return (<div className="row">
			<Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#" onClick={this._toHome}>小Y本</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Navbar.Collapse>
		      <Navbar.Form pullRight>
		        <Input type="text" width="300" placeholder="search" ref={(ref) => this.searchInput = ref}/>
		        {' '}
		        <Button type="submit" onClick={this._search}>搜索</Button>
		      </Navbar.Form>
		   </Navbar.Collapse>
          </Navbar>
          <div style={{margin:"15px"}}>
          	{Content}
          </div>
          </div>)
	}
})

export default List;