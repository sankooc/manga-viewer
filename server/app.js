var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var db = require('./mongo-server');
var ROOT = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/.mrepo';
app.use('/',express.static(__dirname+'/../build'));
app.use('/asset', express.static(ROOT));


function asInt(v){
	v = v.endsWith('.jpg')?v.substring(0,v.length - 4):v;
	// console.log(v)
	return  parseInt(v) || 0;
}
app.get('/api/volumns/:vid',function(req,res){
	var vid = req.params.vid;
	db.get(vid,function(err,volumn){
		if(err){
			console.trace(err.stack);
			return res.status(400);
		}
		var read = volumn.read || 0;
		db.update(vid,{read:++read},function(){});

		if(volumn.list){
			volumn.list.sort(function(v1,v2){
				return asInt(v1) - asInt(v2);
			})
		}
		// console.log(volumn.list);
		res.json(volumn);
	});
});

app.put('/api/volumns/:vid',function(req,res){
	var body = req.body;
	var vid = req.params.vid;
	var option = _.pick(body,'tags','title');
	option.tags = option.tags || [];
	db.update(vid,option,function(err,doc){
		if(err){
			return res.status(400).end();
		}
		res.json(doc);
	});
});

app.delete('/api/volumns/:vid',function(req,res){
	var vid = req.params.vid;
	db.remove(vid,function(err,result){
		if(err){
			return res.status(400).end();
		}
		res.json(res);
	});
});

app.get('/api/volumns',function(req,res){
	var query = req.query;
	var option = _.pick(req.query,'page','per');
	if(_.has(query,'sort')){
		var sort = {};
		sort[query.sort] = -1;
		option.sort = sort;
	}
	if(_.has(query,'kw')){
		var regex = new RegExp(query.kw);
		var filter = {title:regex};
		option.filter = filter;
	}
	db.load(option,function(err,items){
		if(err){
			return res.status(400).end();
		}
		res.json(_.pick(items,'count','items'));
	});
});

app.listen(3030,function(){
	console.log('server connect');
});

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}
