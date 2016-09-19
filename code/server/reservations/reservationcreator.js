var gcalInterface = require('../reservations/gcalinterface');
var accessScheduler = require('../deviceaccess/accessScheduler');
var utils = require('../utils/utils');
var gmailInterface = require('../notifications/gmailinterface');
var twilioInterface = require('../notifications/twiliointerface');

exports.create = function(data, callback)
{ 
   var results = utils.validateBBBIDs(data.bbbIds);
   gcalInterface.validateTimings(results, data.start, data.end, 
   function(updatedResults)
   {
      var login = data.emailId.match(/^([^@]*)@/)[1];
      var eventIds = gcalInterface.createEvents(updatedResults[0], data.emailId, data.start, data.end);
      var password = accessScheduler.schedule(updatedResults[0], data.start, data.end, login, data.loginMethod, data.uid, eventIds, data.emailId, data.keyName, function(password)
         {
            gmailInterface.sendMails(data.emailId, login, data.loginMethod, password, updatedResults[0], updatedResults[1], updatedResults[2], data.start, data.end);
            if(data.cellphoneNumber)
            {
               twilioInterface.sendSms(data.cellphoneNumber, data.start, data.end);
            }
            callback(password, updatedResults[0], updatedResults[1], updatedResults[2], true);
         }); 
   });
}
