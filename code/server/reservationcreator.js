var gcalInterface = require('./gcalinterface');
var accessScheduler = require('./accessScheduler');
var utils = require('./utils');
var gmailInterface = require('./gmailinterface');
var twilioInterface = require('./twiliointerface');

exports.create = function(ids, emailId, startDateTime, endDateTime, login, loginMethod, uid, deleteKey, uploadKey, callback)
{ 
   var results = utils.validateBBBIDs(ids);
   gcalInterface.validateTimings(results, startDateTime, endDateTime, 
   function(updatedResults)
   {
      var eventIds = gcalInterface.createEvents(updatedResults[0], emailId, startDateTime, endDateTime);
      var password = accessScheduler.schedule(updatedResults[0], startDateTime, endDateTime, login, loginMethod, uid, deleteKey, uploadKey, eventIds); 
      gmailInterface.sendMails(emailId, login, loginMethod, password, updatedResults[0], updatedResults[1], updatedResults[2], endDateTime);
      twilioInterface.sendSms();
      callback(password, updatedResults[0], updatedResults[1], updatedResults[2], true);
   });
}
