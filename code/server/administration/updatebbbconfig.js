var BBB = require('../settings/bbbs');

exports.update = function(req, res)
{
	var changedConfigs = JSON.parse(req.body.configs);
	for(var bbbId in changedConfigs)
	{
		var bbbConfig = changedConfigs[bbbId];
		for(var prop in bbbConfig)
		{
			var value = bbbConfig[prop];
			BBB.Info[bbbId][prop] = value;
		}
	}
	res.end();
}
