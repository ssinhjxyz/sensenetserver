var exec = require('child_process').exec;
var BBB = require('./settings/bbbs');

// Constants
var accessServerUser = "access_server";
var accessServerKeyName = "access_server.pub;"
// Encrypted password for "BlueMountains*953"
var accessServerPassword = "papIusctQCe3U";
// Used for adding a default gateway at the BBB
var accessServerIP = "152.14.102.239";
var bbbInterface = "eth0";

exports.add = function(req, res)
{
	var bbbIP = req.body.bbbIP;
	var bbbPort = req.body.bbbPort;
	var bbbID = req.body.bbbID;

	var addUserCommand = "sh ./server/scripts/addaccessserveruser.sh " + bbbIP +  " " + accessServerUser + " " + accessServerPassword;
	var addPublicKeyCommand = "sh ./server/scripts/addaccessserverpublickey.sh " + bbbIP + " " + accessServerUser + " " + accessServerKeyName;
	var portTranslationCommand = "sh ./server/scripts/porttranslation.sh " + bbbIP + " " + bbbPort;
	var addDefaultGatewayCommand = "sh ./server/scripts/adddefaultgateway.sh " + bbbIP + " " + accessServerIP + " " + bbbInterface;

	exec(addUserCommand,
	function (error, stdout, stderr) 
	{
	  console.log('stdout:' + stdout);
	  if (error !== null) 
	  {
	    console.log('exec error: ' + error);
	  }
	  exec(addPublicKeyCommand,    	
		function (error, stdout, stderr) 
		{
	      	console.log('stdout: ' + stdout);
	      	if (error !== null) 
	      	{
			   console.log('exec error: ' + error);
			   res.end(JSON.stringify({status:"error"}));
			   return;
	      	}
	      	exec(portTranslationCommand,    	
	    	function (error, stdout, stderr) 
	    	{
		      	console.log('stdout: ' + stdout);
		      	if (error !== null) 
	          	{
				   console.log('exec error: ' + error);
				   res.end(JSON.stringify({status:"error"}));
				   return;
		      	}
		      	exec(addDefaultGatewayCommand,    	
		    	function (error, stdout, stderr) 
		    	{
	    			console.log('stdout: ' + stdout);
			      	if (error !== null) 
		          	{
					   console.log('exec error: ' + error);
			      	}
			      	BBB.Info[bbbID].IP = bbbIP;
					BBB.Info[bbbID].Port = bbbPort;
					BBB.Info[bbbID].Configured = true;
					BBB.Info[bbbID].Reachability = "unknown";
			      	res.end(JSON.stringify({status:"ok"}));
		      	});
	      	});
	  	});
	  });
}
