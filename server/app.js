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
app.get('/api/volumns/:vid',function(req,res){
	var vid = req.params.vid;
	db.get(vid,function(err,volumn){
		console.log(arguments);
		if(err){
			console.trace(err.stack);
			return res.status(400);
		}
		res.json(volumn);
	});
});

app.put('/api/volumns/:vid',function(req,res){
	var body = req.body;
	var vid = req.params.vid;
	var option = _.pick(body,'tag','title');
	db.update(vid,option,function(err,doc){
		if(err){
			return res.status(400).end();
		}
		res.json(doc);
	})
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
	console.log(option);
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

