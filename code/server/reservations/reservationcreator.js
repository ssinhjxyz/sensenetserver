var gcalInterface = require('../reservations/gcalinterface');
var accessScheduler = require('../deviceaccess/accessScheduler');
var utils = require('../utils/utils');
var gmailInterface = require('../notifications/gmailinterface');
var twilioInterface = require('../notifications/twiliointerface');

exports.create = function(ids, emailId, startDateTime, endDateTime, login, loginMethod, uid, callback)
{ 
   var results = utils.validateBBBIDs(ids);
   gcalInterface.validateTimings(results, startDateTime, endDateTime, 
   function(updatedResults)
   {
      var eventIds = gcalInterface.createEvents(updatedResults[0], emailId, startDateTime, endDateTime);
      var password = accessScheduler.schedule(updatedResults[0], startDateTime, endDateTime, login, loginMethod, uid, eventIds, emailId, function(password)
         {
            gmailInterface.sendMails(emailId, login, loginMethod, password, updatedResults[0], updatedResults[1], updatedResults[2], endDateTime);
            twilioInterface.sendSms();
            callback(password, updatedResults[0], updatedResults[1], updatedResults[2], true);
         }); 
      
   });
}
