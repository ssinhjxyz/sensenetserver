var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var schedule = require('node-schedule');
var BBB = require('./bbbs');
var utils = require('./utils');

exports.schedule = function(ids, startDateTime, endDateTime, login, loginMethod, uid)
{
  var password = "";
  if(loginMethod === "password")
  {
    password = utils.makeRandomString(6);
  }

  var numIds = ids.length;
  for(var i = 0; i < numIds; i++)
  { 
    var bbbIP = BBB.IPS[ids[i]];
    if(bbbIP)
    {
      if(loginMethod === "password")
      {
        schedulePasswordAccess(startDateTime, endDateTime, bbbIP, password, login);
      }
      else if (loginMethod === "rsa")
      {
        scheduleRSAAccess(startDateTime, endDateTime, login, bbbIP, uid);
      }
    }
  }
  return password 
}


function scheduleRSAAccess(startDateTime, endDateTime, login, bbbIP, uid)
{
 
  var addUserCommand = "sh ./server/adduser.sh " + bbbIP +  " " + login + " papAq5PwY/QQM " + "password";
  var addPublicKeyCommand = "sh ./server/addpublickey.sh " + bbbIP + " " + login + " " + uid;
  // first create the user, then add the public key
  var createReservation = schedule.scheduleJob(startDateTime, function()
  {
    exec(addUserCommand,
    function (error, stdout, stderr) 
    {
      console.log("user " + login + " created");
    	exec(addPublicKeyCommand,    	
    	function (error, stdout, stderr) 
    	{
    	      	//console.log("public key " + login + " added");
    	      	console.log('stdout: ' + stdout);
    	      	//console.log('stderr: ' + stderr);
    	      	if (error !== null) 
              {
    			       console.log('exec error: ' + error);
    	      	}
      	});
        if (error !== null) 
        {
          console.log('exec error: ' + error);
        }
      });
    });
  	
   var deleteUserCommand = "sh ./server/deleteuser.sh " + bbbIP + " " + login + " " + uid;
   var endReservation = schedule.scheduleJob(endDateTime, function(){
      exec(deleteUserCommand,
      function (error, stdout, stderr) {
        console.log("user " + login + " deleted");
        if (error !== null) {
          console.log('exec error: ' + error);
        }
    });
  });
}


function schedulePasswordAccess(startDateTime, endDateTime, bbbIP, password, login)
{  
  var python = spawn('python', ["./server/encodepassword.py", password]);
  python.stdout.on('data', 
  function(encpasswd)
  { 
  var command = "sh ./server/adduser.sh " + bbbIP + " " + login + " " + encpasswd.toString().slice(0,-1) + " " + password;
  var createUser = schedule.scheduleJob(startDateTime, function(){
    exec(command,
    function (error, stdout, stderr) 
    {
      console.log("user " + login + " created");
      //console.log('stdout: ' + stdout);
      //console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
  });});

  var killUser = schedule.scheduleJob(endDateTime, function()
  {
    exec("sh ./server/deleteuser.sh " + bbbIP + " " + login,
        function (error, stdout, stderr) {
          console.log("user " + login + " deleted");
          if (error !== null) {
            console.log('exec error: ' + error);
          }
 }); }); });

}
