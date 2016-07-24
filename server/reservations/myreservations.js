var google = require('googleapis');
var CALENDAR = require('../settings/calendars');
var BBB = require('../settings/bbbs');
var authToken = require('../authentication/authtoken');
var utils = require('../utils');

exports.get = function (emailId, res)
{
    var now = new Date();
  	var that = this;
    var calendarId = CALENDAR.IDS[1];
    var calendar = google.calendar('v3');
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
      res.end(JSON.stringify(response.items));
    });  
}
