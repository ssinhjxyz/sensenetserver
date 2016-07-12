var gcalInterface = require('./gcalinterface');
var accessScheduler = require('./accessScheduler');
var utils = require('./utils');
var gmailInterface = require('./gmailinterface');
var twilioInterface = require('./twiliointerface');

exports.create = function(ids, emailId, startDateTime, endDateTime, login, loginMethod, uid, callback)
{  
   var results = utils.validateBBBIDs(ids);
   gcalInterface.validateTimings(results, startDateTime, endDateTime, 
   function(updatedResults)
   {
      gcalInterface.createEvents(updatedResults[0], emailId, startDateTime, endDateTime);
      var password = accessScheduler.schedule(ids, startDateTime, endDateTime, login, loginMethod, uid); 
      gmailInterface.sendMails(emailId, login, password, updatedResults[0], updatedResults[1], updatedResults[2], true, endDateTime);
      twilioInterface.sendSms();
      callback(password, updatedResults[0], updatedResults[1], updatedResults[2], true);
   });
}
