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
  nextRun.setUTCMinutes(nextRun.getUTCMinutes() + 10);
  var numBBBs = BBB.Info.length
  for(var i = 0; i < numBBBs; i++)
  {
    checkReachability(i);
  } 
  schedule.scheduleJob(nextRun, function(){run();});
} 

checkReachability = function(i)
{
    var bbbIP = BBB.Info[i].IP;
    exec("sh ./server/checkreachability.sh " + bbbIP,
        function (error, stdout, stderr) 
        {
          if (error !== null) 
          {
            console.log('exec error: ' + error);
          }
          BBB.Info[i].Reachability = stdout;
        }); 

}