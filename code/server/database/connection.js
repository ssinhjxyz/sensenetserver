var MongoClient = require('mongoskin').MongoClient;
var DATABASE = require('../settings/database');
var assert = require('assert');

exports.object = {};

exports.connect = function()
{
	var url = 'mongodb://' + DATABASE.Info.user + ':' + DATABASE.Info.password + '@localhost/' + DATABASE.Info.databaseName;
	// Connect to the db
	exports.object = MongoClient.connect(url);
}