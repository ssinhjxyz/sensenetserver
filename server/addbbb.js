var exec = require('child_process').exec;

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
	console.log(bbbIP);
	console.log(bbbPort);

	var addUserCommand = "sh ./server/addaccessserveruser.sh " + bbbIP +  " " + accessServerUser + " " + accessServerPassword;
  	var addPublicKeyCommand = "sh ./server/addaccessserveruser.sh " + bbbIP + " " + accessServerUser + " " + accessServerKeyName;
  	var portTranslationCommand = "sh ./server/porttranslation.sh " + bbbIP + " " + bbbPort;
  	var addDefaultGatewayCommand = "sh ./server/adddefaultgateway.sh " + bbbIP + " " + accessServerIP + " " + bbbInterface;

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
	      	}
	      	exec(portTranslationCommand,    	
	    	function (error, stdout, stderr) 
	    	{
		      	console.log('stdout: ' + stdout);
		      	if (error !== null) 
	          	{
				   console.log('exec error: ' + error);
		      	}
		      	exec(addDefaultGatewayCommand,    	
		    	function (error, stdout, stderr) 
		    	{
			      	console.log('stdout: ' + stdout);
			      	if (error !== null) 
		          	{
					   console.log('exec error: ' + error);
			      	}
		      	});
	      	});

      	});
      });
}
