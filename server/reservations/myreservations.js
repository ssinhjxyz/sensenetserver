var google = require('googleapis');
var CALENDAR = require('../settings/calendars');
var BBB = require('../settings/bbbs');
var authToken = require('../authentication/authtoken');

exports.get = function (emailId)
{
  	var that = this;
    var calendarId = CALENDAR.IDS[1];
    var calendar = google.calendar('v3');
    calendar.events.list(
    {
      auth: authToken.token,
      calendarId: calendarId,
      q:"s.singh.xyz@gmail.com",
      singleEvents: true,
      orderBy: 'startTime'
    }, 
    function(err, response) 
    {
      console.log(response.items.length);
    });  
}

