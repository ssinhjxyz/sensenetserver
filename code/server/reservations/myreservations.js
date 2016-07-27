var google = require('googleapis');
var BBB = require('../settings/bbbs');
var authToken = require('../authentication/authtoken');
var utils = require('../utils');

exports.get = function (emailId, res)
{

    var now = new Date();
  	var that = this;

    var calendar = google.calendar('v3');
    var calendarIds = [];
    
    // Store all valid calendars
    for(var i in BBB.Info)
    {
      var calendarId = BBB.Info[i].CalendarId;
      if(calendarId)
      {
        calendarIds.push(calendarId); 
      }
    }

    // Get events from all valid calendars containing the emailId in any field.
    var numCalendars = calendarIds.length;
    var numResponses = 0;
    var events = [];
    for(var i = 0; i < numCalendars; i++)
    {
        calendarId = calendarIds[i];
        calendar.events.list(
        {
          auth: authToken.token,
          calendarId: calendarId,
          q:emailId,
          singleEvents: true,
          orderBy: 'startTime',
          timeMin: utils.ISODateString(now)
        }, 
        function(err, response) 
        {
          
          numResponses++;
          events.push.apply(events, response.items)
          // If we have received all the responses from all calendars, 
          // send the items back to the HTTP request
          if(numResponses == numCalendars)
          {   
            res.end(JSON.stringify(events));
          }
        });  
    }
}
