var gcalInterface = require('./gcalinterface');
var accessScheduler = require('./accessScheduler');
var utils = require('./utils');
var gmailInterface = require('./gmailinterface');

exports.create = function(ids, emailId, startDateTime, endDateTime, login, loginMethod, uid, callback)
{  
   var results = utils.validateBBBIDs(ids);
   gcalInterface.validateEvent(startDateTime, endDateTime, 
   function(isValidEvent)
   {
      if(isValidEvent)
      {
        gcalInterface.createEvents(ids, emailId, startDateTime, endDateTime);
        var password = "";//accessScheduler.schedule(ids, startDateTime, endDateTime, login, loginMethod, uid); 
      } 
      gmailInterface.sendMails(emailId, login, password, results[0], results[1], results[2], isValidEvent, endDateTime);
      callback(password, results[0], results[1], results[2], isValidEvent);
   });
}
