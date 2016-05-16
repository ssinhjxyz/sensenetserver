var gcalInterface = require('./gcalInterface');
var accessScheduler = require('./accessScheduler');
var utils = require('./utils');

exports.createReservation = function(ids, emailId, startDateTime, endDateTime, login, loginMethod, uid, callback){
  
   var results = utils.validateBBBIDs(ids);
   gcalInterface.validateEvent(startDateTime, endDateTime, 
   function(isValidEvent)
   {
      if(isValidEvent)
      {
        gcalInterface.createEvents(ids, emailId, startDateTime, endDateTime);
        var password = accessScheduler.schedule(ids, startDateTime, endDateTime, login, loginMethod, uid); 
      } 
      callback(password, results[0], results[1], results[2], isValidEvent);
   });
}