var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var schedule = require('node-schedule');
var BBB = require('../settings/bbbs');
var utils = require('../utils/utils');
var gcalInterface = require('../reservations/gcalinterface');
var fs = require('fs');
var users = require('../database/users');

exports.schedule = function(ids, startDateTime, endDateTime, login, loginMethod, uid, eventIds, emailId, keyName, callback)
{
  var password = "";
  var numIds = ids.length;
  users.getCredentials(emailId, function(credentials)
  {
    var password = credentials.password;
    var key = utils.getUserKey(credentials.keys, keyName);
    for(var i = 0; i < numIds; i++)
    { 
      var bbbIP = BBB.Info[ids[i]].IP;
      if(bbbIP)
      {
        if(loginMethod === "password")
        {
          schedulePasswordAccess(startDateTime, endDateTime, bbbIP, password, login, BBB.Info[ids[i]].CalendarId, eventIds[i]);       
        }
        else if (loginMethod === "rsa")
        {
          scheduleRSAAccess(startDateTime, endDateTime, login, bbbIP, uid, BBB.Info[ids[i]].CalendarId, eventIds[i], key.key);
        }
      }
    }
    callback(password);
  });
}

function scheduleRSAAccess(startDateTime, endDateTime, login, bbbIP, uid, calendarId, eventId, key)
{
  var addUserCommand = "sh ./server/scripts/adduser.sh " + bbbIP +  " " + login + " papAq5PwY/QQM " + "password";
  var addPublicKeyCommand = "sh ./server/scripts/addpublickey.sh " + bbbIP + " " + login + " " + uid + " " + key;
  
  // first create the user, then add the public key
  var createReservation = schedule.scheduleJob(startDateTime, function()
  {
    console.log(addPublicKeyCommand);
    // check if the event still exists or has been deleted by the user.
    gcalInterface.checkIfEventExists(calendarId, eventId, function(exists)
      {
        if(!exists)
          return;

        exec(addUserCommand,
        function (error, stdout, stderr) 
        {
          console.log("user " + login + " created");
          console.log('stdout:' + stdout);
          console.log('exec error:' + error);
  
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
    
    });
  	
   // disable login for the user and delete the public key.
   var deleteUserCommand = "sh ./server/scripts/deleteuser.sh " + bbbIP + " " + login + " " + uid;
   var deletePublicKeyCommand = "sh ./server/scripts/deletepublickey.sh " + bbbIP + " " + login + " " + uid;
   var endReservation = schedule.scheduleJob(endDateTime, function()
   {
      exec(deleteUserCommand,
      function (error, stdout, stderr) 
      {
        console.log("user " + login + " deleted");
        if (error !== null) 
        {
          console.log('exec error: ' + error);
        }
        console.log('stdout:' + stdout);
        console.log('exec error:' + error);


          exec(deletePublicKeyCommand,     
          function (error, stdout, stderr) 
          {
              console.log("public key " + login + " deleted");
              console.log('stdout: ' + stdout);
              if (error !== null) 
              {
                 console.log('exec error: ' + error);
              }
              deleteLocallyStoredKey(uid);
          });
      });
  });
}


function deleteLocallyStoredKey(uid)
{
  // delete locally stored key
  fs.unlink('./server/uploads/' + uid, (err) =>  {
            if (err)
            {
              console.log('error deleting public key');
              console.log(err);  
            } 
            console.log('successfully deleted /tmp/hello');
          });

}

function schedulePasswordAccess(startDateTime, endDateTime, bbbIP, password, login, calendarId, eventId)
{  
  var python = spawn('python', ["./server/scripts/encodepassword.py", password]);
  python.stdout.on('data', 
  function(encpasswd)
  { 
    var command = "sh ./server/scripts/adduser.sh " + bbbIP + " " + login + " " + encpasswd.toString().slice(0,-1) + " " + password;
    var createUser = schedule.scheduleJob(startDateTime, function()
    {
      gcalInterface.checkIfEventExists(calendarId, eventId, function(exists)
      {
          if(!exists)
            return;
          
          exec(command,
          function (error, stdout, stderr) 
          {
            console.log("user " + login + " created");
            if (error !== null) 
            {
              console.log('exec error: ' + error);
            }
          });
      });  
    });

  var killUser = schedule.scheduleJob(endDateTime, function()
  {
    exec("sh ./server/scripts/deleteuser.sh " + bbbIP + " " + login,
        function (error, stdout, stderr) {
          console.log("user " + login + " deleted");
          if (error !== null) {
            console.log('exec error: ' + error);
          }
 }); }); });
}
