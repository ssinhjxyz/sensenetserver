var ADMINS = require('../settings/admins');

exports.authorize = function(emailId)
{
	var authorized = false;
	var match = ADMINS.List.indexOf(emailId);
	if(match > -1) 
	{
		authorized = true;
	}
	return authorized;
}