var exec = require('child_process').exec;
var schedule = require('node-schedule');
var BBB = require('./bbbs');

exports.run = function()
{
  var nextRun = new Date();
  nextRun.setUTCMinutes(nextRun.getUTCMinutes() + 5);

  var numBBBs = BBB.IPS.size();
  for(var i = 0; i < numBBBs; i++)
  {
    var bbbIP = BBB.IPS[i];
    exec("sh ./server/checkreachability.sh " + bbbIP,
        function (error, stdout, stderr) 
        {
          console.log("user " + login + " deleted");
          if (error !== null) 
          {
            console.log('exec error: ' + error);
          }
          console.log("reachability " + BBB.IPS[i] )
        }); 
  } 
  schedule.scheduleJob(nextRun, export.run);
} 
