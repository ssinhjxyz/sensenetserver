var exec = require('child_process').exec;
var schedule = require('node-schedule');
var BBB = require('./settings/bbbs');

exports.start = function()
{
  run();
}

run = function()
{
  var nextRun = new Date();
  nextRun.setUTCMinutes(nextRun.getUTCMinutes() + 1);
  var numBBBs = BBB.Info.length
  for(var i in BBB.Info)
  {
    checkReachability(i);
  } 
  schedule.scheduleJob(nextRun, function(){run();});
} 

checkReachability = function(i)
{
    var bbbIP = BBB.Info[i].IP;
    exec("sh ./server/scripts/checkreachability.sh " + bbbIP,
        function (error, stdout, stderr) 
        {
          if (error !== null) 
          {
            console.log('exec error: ' + error);
          }
          // The stdout has a "newline" character at the end. Remove this character.
          stdout = stdout.slice(0,-1);
          BBB.Info[i].Reachability = stdout;
        }); 
}