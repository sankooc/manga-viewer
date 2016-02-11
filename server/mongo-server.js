var client = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var async = require('async');
var url = 'mongodb://localhost:27017/mango';
var docName = 'mond';
function _connect(callback){
	client.connect(url, callback);
}


exports.insert = function(volumn,callback){
	var _db;
	async.waterfall([async.apply(_connect),function(db,callback){
		var collection = db.collection(docName);
		_db = db;
		collection.insert(volumn,callback)
	}],function(err,result){
		callback(err,result);
		_db.close();
	});
};

exports.multi = function(arr,callback){
	var _db;
	async.waterfall([async.apply(_connect),function(db,callback){
		var collection = db.collection(docName);
		_db = db;
		collection.insertMany(arr,callback)
	}],function(err,result){
		callback(err,result);
		_db.close();
	});
};


function _find(option,callback){
	var _db;
	var filter = option.filter || {};
	var page = parseInt(option.page || 1);
	var per = parseInt(option.per || 10);
	var skip = (page -1) * per;

	async.auto({
		connect: async.apply(_connect),
		count: ['connect',function(callback,ret){
			_db = _db || ret.connect;
			var collection = _db.collection(docName);
			collection.count(filter,callback);
		}],
		items: ['connect',function(callback,ret){
			_db = _db || ret.connect;
			var collection = _db.collection(docName);
			var cursor = collection.find(filter).skip(skip).limit(per);
			if(option.sort){
				cursor.sort(option.sort);
			}
			cursor.toArray(callback);
		}]
	},function(err,result){
		callback(err,result);
		if(err){
			return;
		}
		_db.close();
	});
}

exports.load = function(option,callback){
		_find(option,callback);
};

exports.get = function(vid,callback){
	var _db;
	async.waterfall([async.apply(_connect),function(db,callback){
		var collection = db.collection(docName);
		_db = db;
		collection.findOne({vid:parseInt(vid)},callback);
	}],function(err,result){
		callback(err,result);
		_db.close();
	});
};

exports.find = function(option,callback){
	var _db;
	async.waterfall([async.apply(_connect),function(db,callback){
		var collection = db.collection(docName);
		_db = db;
		collection.find({title:kw}).toArray(callback);
	}],function(err,result){
		callback(err,result);
		_db.close();
	});
};

exports.update = function(vid,option,callback){
	var _db;
	async.waterfall([async.apply(_connect),function(db,callback){
		var collection = db.collection(docName);
		_db = db;
		collection.findOneAndUpdate({"vid":parseInt(vid)},{$set:option},callback);
	}],function(err,result){
		callback(err,result);
		_db.close();
	});
};



exports.remove = function(vid,callback){
	var _db;
	async.waterfall([async.apply(_connect),function(db,callback){
		var collection = db.collection(docName);
		_db = db;
		collection.findOneAndDelete({"vid":vid},callback);
	}],function(err,result){
		callback(err,result);
		_db.close();
	});
}



